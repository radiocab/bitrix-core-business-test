import { Type, Dom, Loc, Reflection, Event } from 'main.core';
import { MenuManager } from 'main.popup';
import { BaseEvent, EventEmitter } from 'main.core.events';
import { getGlobalContext, Tracker, Designer, ConditionGroupSelector, ConditionGroup, DelayIntervalSelector } from 'bizproc.automation';
import { Robot } from './robot'
import { UserOptions } from './user-options';
import { ViewMode } from './view-mode';
import { Helper } from './helper';
import { HelpHint } from './help-hint';
import { DelayInterval } from './delay-interval';

export class Template extends EventEmitter
{
	constants: Object<string, any>;
	globalConstants: Array<Object>;
	variables: Object<string, any>;
	globalVariables: Array<Object>;
	robotSettingsControls;

	#selectors;
	#delayMinLimitM: number;
	#userOptions: UserOptions | null;
	#tracker: Tracker;
	#viewMode: ViewMode;

	#templateContainerNode: Element;
	#templateNode: ?Element;
	#listNode: Element | undefined;
	#buttonsNode: Element | undefined;
	#topButtonsNode: Element | undefined;

	#robots: Array<Robot>;
	#data: Object;

	constructor(params: {
		templateContainerNode: Element,
		selectors: Object,
		constants: Object<string, any>,
		globalConstants: Array<Object>,
		variables: Object<string, any>,
		globalVariables: Array<Object>,
		userOptions: ?UserOptions,
		delayMinLimitM: number,
	})
	{
		super();
		this.setEventNamespace('BX.Bizproc.Automation');

		this.constants = params.constants;
		this.globalConstants = params.globalConstants;
		this.variables = params.variables;
		this.globalVariables = params.globalVariables;

		this.#templateContainerNode = params.templateContainerNode;
		this.#selectors = params.selectors;
		this.#delayMinLimitM = params.delayMinLimitM;
		this.#userOptions = params.userOptions;
		this.#tracker = getGlobalContext().tracker;
		this.#data = {};
		this.#robots = [];
		this.#viewMode = ViewMode.none();
	}

	init(data: Object, viewMode: number)
	{
		if (Type.isPlainObject(data))
		{
			this.#data = data;
			if (!Type.isPlainObject(this.#data.CONSTANTS))
			{
				this.#data.CONSTANTS = {};
			}
			if (!Type.isPlainObject(this.#data.PARAMETERS))
			{
				this.#data.PARAMETERS = {};
			}
			if (!Type.isPlainObject(this.#data.VARIABLES))
			{
				this.#data.VARIABLES = {};
			}

			this.markExternalModified(this.#data['IS_EXTERNAL_MODIFIED']);
			this.markModified(false);
		}

		this.#viewMode = ViewMode.fromRaw(viewMode);

		if (!this.#viewMode.isNone())
		{
			this.#templateNode = this.#templateContainerNode.querySelector(
				'[data-role="automation-template"][data-status-id="' + this.#data.DOCUMENT_STATUS + '"]'
			);
			this.#listNode = this.#templateNode.querySelector('[data-role="robot-list"]');
			this.#buttonsNode = this.#templateNode.querySelector('[data-role="buttons"]');
			this.#topButtonsNode = this.#templateNode.querySelector('[data-role="top-buttons"]');

			this.initRobots();
			this.initButtons();
			this.updateTopButtonsVisibility();

			if (!this.isExternalModified() && this.canEdit())
			{
				//register DD
				jsDD.registerDest(this.#templateNode, 10);
			}
			else
			{
				jsDD.unregisterDest(this.#templateNode);
			}
		}
	}

	reInit(data: Object, viewMode: number)
	{
		Dom.clean(this.#listNode);
		Dom.clean(this.#buttonsNode);
		Dom.clean(this.#topButtonsNode);

		this.destroy();
		this.init(data, viewMode);
	}

	destroy()
	{
		this.#robots.forEach(robot => robot.destroy());
	}

	static copyRobotTo(dstTemplate: Template, robot: Robot, beforeRobot: ?Robot): Robot
	{
		const copiedRobot = robot.copyTo(dstTemplate, beforeRobot);
		dstTemplate.emit('Template:robot:add', {robot: copiedRobot});
	}

	canEdit()
	{
		return getGlobalContext().canEdit;
	}

	initRobots()
	{
		this.#robots = [];

		if (Type.isArray(this.#data.ROBOTS))
		{
			for (let i = 0; i < this.#data.ROBOTS.length; ++i)
			{
				const robot = new Robot({
					document: getGlobalContext().document,
					template: this,
					isFrameMode: getGlobalContext().get('isFrameMode'),
					tracker: this.#tracker,
				});
				robot.init(this.#data.ROBOTS[i], this.#viewMode);
				this.insertRobotNode(robot.node);
				this.#robots.push(robot);
			}
		}
	}

	get robots(): Array<Robot>
	{
		return this.#robots;
	}

	get userOptions(): ?UserOptions
	{
		return this.#userOptions;
	}

	getSelectedRobotNames(): Array<Robot>
	{
		const selectedRobots = [];

		this.#robots.forEach(robot => {
			if (robot.isSelected())
			{
				selectedRobots.push(robot.data.Name);
			}
		});

		return selectedRobots;
	}

	getSerializedRobots()
	{
		const serialized = [];
		this.#robots.forEach(robot => serialized.push(robot.serialize()));

		return serialized;
	}

	getId()
	{
		return this.#data.ID;
	}

	getStatusId(): ?string
	{
		return this.#data.DOCUMENT_STATUS;
	}

	getTemplateId()
	{
		const id = parseInt(this.#data.ID);

		return !isNaN(id) ? id : 0;
	}

	initButtons()
	{
		if (this.isExternalModified())
		{
			this.createExternalLocker();
		}
		else if (this.#viewMode.isEdit())
		{
			this.createAddButton();

			if (this.getTemplateId() > 0)
			{
				this.createConstantsEditButton();
				this.createParametersEditButton();
				this.createExternalEditTemplateButton();
				this.createManageModeButton();
			}
		}
	}

	enableManageMode(isActive: boolean)
	{
		if (this.#listNode)
		{
			this.#viewMode = ViewMode.manage().setProperty('isActive', isActive);

			if (isActive)
			{
				Dom.addClass(this.#listNode, '--multiselect-mode');
			}

			if (this.isExternalModified())
			{
				Dom.addClass(this.#listNode, '--locked-node');
			}
			else
			{
				this.#robots.forEach(robot => robot.enableManageMode(isActive));
			}
		}
	}

	disableManageMode()
	{
		if (this.#listNode)
		{
			this.#viewMode = ViewMode.edit();
			Dom.removeClass(this.#listNode, '--multiselect-mode');
			if (this.isExternalModified())
			{
				Dom.removeClass(this.#listNode, '--locked-node');
			}
			else
			{
				this.#robots.forEach(robot => robot.disableManageMode());
			}

			this.#templateNode.querySelectorAll('.bizproc-automation-robot-container-wrapper').forEach(node => {
				Dom.addClass(node, 'bizproc-automation-robot-container-wrapper-draggable');
			});
		}
	}

	enableDragAndDrop()
	{
		this.#robots.forEach(robot => robot.registerItem(robot.node));

		this.#templateNode.querySelectorAll('.bizproc-automation-robot-container-wrapper').forEach(node => {
			Dom.addClass(node, 'bizproc-automation-robot-container-wrapper-draggable');
		});
	}

	disableDragAndDrop()
	{
		this.#robots.forEach(robot => robot.unregisterItem(robot.node));

		this.#templateNode.querySelectorAll('.bizproc-automation-robot-container-wrapper').forEach(node => {
			Dom.removeClass(node, 'bizproc-automation-robot-container-wrapper-draggable');
		});
	}

	createAddButton()
	{
		const anchor = () => Dom.create('span', {
			events: {
				click: event => {
					if (!this.canEdit())
					{
						HelpHint.showNoPermissionsHint(event.target);
					}
					else if (!this.#viewMode.isManage())
					{
						this.onAddButtonClick(event.target);
					}
				}
			},
			attrs: {
				className: 'bizproc-automation-robot-btn-add'
			},
			children: [
				Dom.create('span', {
					attrs: {
						className: 'bizproc-automation-btn-add-text',
					},
					text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_ADD'),
				})
			]
		});

		if (this.#topButtonsNode)
		{
			this.#topButtonsNode.appendChild(anchor());
		}

		if (this.#buttonsNode)
		{
			this.#buttonsNode.appendChild(anchor());
		}
	}

	updateTopButtonsVisibility()
	{
		if (this.#topButtonsNode)
		{
			let fn = (this.#robots && this.#robots.length < 1) ? 'hide' : 'show';

			if (this.isExternalModified())
			{
				fn = 'show';
			}

			BX[fn](this.#topButtonsNode);
		}
	}

	createExternalEditTemplateButton(): undefined | boolean
	{
		if (Type.isNil(getGlobalContext().bizprocEditorUrl))
		{
			return false;
		}

		const self = this;
		const anchor = Dom.create('a', {
			text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_EXTERNAL_EDIT'),
			props: {
				href: '#'
			},
			events: {
				click(event)
				{
					event.preventDefault();

					if (!self.#viewMode.isManage())
					{
						self.onExternalEditTemplateButtonClick(this);
					}
				}
			},
			attrs: {
				className: "bizproc-automation-robot-btn-set",
				target: '_top'
			}
		});

		if (!getGlobalContext().bizprocEditorUrl.length)
		{
			Dom.addClass(anchor, 'bizproc-automation-robot-btn-set-locked');
		}

		this.#buttonsNode.appendChild(anchor);
	}

	createManageModeButton()
	{
		if (!getGlobalContext().canManage)
		{
			return;
		}

		const manageButton = Dom.create('a', {
			text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_MANAGE_ROBOTS'),
			attrs: {
				className: "bizproc-automation-robot-btn-set",
				target: '_top',
			},
			style: {
				cursor: 'pointer',
			},
			events: {
				click: event => {
					event.preventDefault();
					this.onManageModeButtonClick(manageButton);
				},
			}
		});

		this.#buttonsNode.appendChild(manageButton);
	}

	onManageModeButtonClick(manageButtonNode: HTMLElement)
	{
		if (!this.canEdit())
		{
			HelpHint.showNoPermissionsHint(manageButtonNode);
		}
		else
		{
			this.emit('Template:enableManageMode', {
				documentStatus: this.#data.DOCUMENT_STATUS,
			});
		}
	}

	createConstantsEditButton(): boolean | undefined
	{
		if (Type.isNil(getGlobalContext().constantsEditorUrl))
		{
			return false;
		}

		const url =
			!this.#viewMode.isManage()
				? getGlobalContext().constantsEditorUrl.replace('#ID#', this.getTemplateId())
				: '#'
		;

		if (!url.length)
		{
			return false;
		}

		const anchor = Dom.create('a', {
			text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_CONSTANTS_EDIT'),
			props: {
				href: url
			},
			attrs: { className: "bizproc-automation-robot-btn-set" }
		});

		this.#buttonsNode.appendChild(anchor);
	}

	createParametersEditButton(): boolean | undefined
	{
		if (Type.isNil(getGlobalContext().parametersEditorUrl))
		{
			return false;
		}

		const url = getGlobalContext().parametersEditorUrl.replace('#ID#', this.getTemplateId());

		if (!url.length || this.#viewMode.isManage())
		{
			return false;
		}

		const anchor = Dom.create('a', {
			text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_PARAMETERS_EDIT'),
			props: {
				href: url
			},
			attrs: { className: "bizproc-automation-robot-btn-set" }
		});

		this.#buttonsNode.appendChild(anchor);
	}

	createExternalLocker()
	{
		if (this.#topButtonsNode)
		{
			this.#topButtonsNode.appendChild(
				Dom.create('span', {
					attrs: { className: 'bizproc-automation-robot-btn-prohibit' }
				})
			);
		}

		const div = Dom.create("div", {
			attrs: {
				className: "bizproc-automation-robot-container"
			},
			children: [
				Dom.create('div', {
					attrs: {
						className: 'bizproc-automation-robot-container-wrapper bizproc-automation-robot-container-wrapper-lock'
					},
					children: [
						Dom.create("div", {
							attrs: { className: "bizproc-automation-robot-deadline" }
						}),
						Dom.create("div", {
							attrs: { className: "bizproc-automation-robot-title" },
							text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_EXTERNAL_EDIT_TEXT')
						}),
					]
				})
			]
		});

		if (this.#viewMode.isEdit())
		{
			const settingsBtn = Dom.create('div', {
				attrs: {
					className: 'bizproc-automation-robot-btn-settings'
				},
				text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_EDIT')
			});

			const self = this;
			Event.bind(div, 'click', function (event) {
				event.stopPropagation();
				if (!self.#viewMode.isManage())
				{
					self.onExternalEditTemplateButtonClick(this);
				}
			});
			div.appendChild(settingsBtn);

			const deleteBtn = Dom.create('SPAN', {
				attrs: {
					className: 'bizproc-automation-robot-btn-delete'
				}
			});

			Event.bind(deleteBtn, 'click', function (event) {
				event.stopPropagation();

				if (!self.#viewMode.isManage())
				{
					self.onUnsetExternalModifiedClick(this);
				}
			});
			div.lastChild.appendChild(deleteBtn);
		}

		this.#listNode.appendChild(div);
		this.#templateNode = div;
	}

	onSearch(event: BaseEvent)
	{
		if (this.isExternalModified())
		{
			this.onExternalModifiedSearch(event);
		}
		else
		{
			this.#robots.forEach(robot => robot.onSearch(event));
		}
	}

	onExternalModifiedSearch(event)
	{
		if (this.#templateNode)
		{
			const query = event.getData().queryString;
			BX[!query ? 'removeClass' : 'addClass'](this.#templateNode, '--search-mismatch');
		}
	}

	onAddButtonClick(button, context)
	{
		const menuItems = {
			employee: [],
			client: [],
			ads: [],
			other: []
		};
		const availableRobots = getGlobalContext().availableRobots;

		if (!Type.isPlainObject(context))
		{
			context = {};
		}

		const self = this;
		const menuItemClickHandler = function (event, item)
		{
			const robotData = BX.clone(item.robotData);

			if (
				robotData['ROBOT_SETTINGS']
				&& robotData['ROBOT_SETTINGS']['TITLE_CATEGORY']
				&& robotData['ROBOT_SETTINGS']['TITLE_CATEGORY'][item.category]
			)
			{
				robotData['NAME'] = robotData['ROBOT_SETTINGS']['TITLE_CATEGORY'][item.category];
			}
			else if (robotData['ROBOT_SETTINGS'] && robotData['ROBOT_SETTINGS']['TITLE'])
			{
				robotData['NAME'] = robotData['ROBOT_SETTINGS']['TITLE'];
			}

			self.addRobot(robotData, function(robot)
			{
				context.ADD_MENU_CATEGORY = item.category;
				this.openRobotSettingsDialog(robot, context);
			});

			this.getRootMenuWindow().close();
		};

		for (let i = 0; i < availableRobots.length; ++i)
		{
			if (availableRobots[i]['EXCLUDED'])
			{
				continue;
			}
			const settings =
				Type.isPlainObject(availableRobots[i]['ROBOT_SETTINGS'])
					? availableRobots[i]['ROBOT_SETTINGS']
					: {}
			;

			let title = availableRobots[i].NAME;
			if (settings['TITLE'])
			{
				title = settings['TITLE'];
			}

			let categories = [];
			if (settings['CATEGORY'])
			{
				categories = Type.isArray(settings['CATEGORY']) ? settings['CATEGORY'] : [settings['CATEGORY']];
			}

			if (!categories.length)
			{
				categories.push('other');
			}

			for (let j = 0; j < categories.length; ++j)
			{
				if (!menuItems[categories[j]])
				{
					continue;
				}

				menuItems[categories[j]].push({
					text: title,
					robotData: availableRobots[i],
					category: categories[j],
					onclick: menuItemClickHandler,
				});
			}
		}

		if (menuItems['other'].length > 0)
		{
			menuItems['other'].push({delimiter: true});
		}

		if (Reflection.getClass('BX.rest.Marketplace'))
		{
			menuItems['other'].push({
				text: Loc.getMessage('BIZPROC_AUTOMATION_ROBOT_CATEGORY_OTHER_MARKETPLACE_2'),
				onclick()
				{
					BX.rest.Marketplace.open({}, getGlobalContext().get('marketplaceRobotCategory'));
					this.getRootMenuWindow().close();
				},
			});
		}
		else
		{
			menuItems['other'].push({
				text: Loc.getMessage('BIZPROC_AUTOMATION_ROBOT_CATEGORY_OTHER_MARKETPLACE_2'),
				href:
					'/marketplace/category/%category%/'
						.replace('%category%', getGlobalContext().get('marketplaceRobotCategory')),
				target: '_blank'
			});
		}

		let menuId = button.getAttribute('data-menu-id');
		if (!menuId)
		{
			menuId = Helper.generateUniqueId();
			button.setAttribute('data-menu-id', menuId);
		}

		const rootMenuItems = [];
		if (menuItems['employee'].length > 0)
		{
			rootMenuItems.push({
				text: Loc.getMessage('BIZPROC_AUTOMATION_ROBOT_CATEGORY_EMPLOYEE'),
				items: menuItems['employee']
			});
		}
		if (menuItems['client'].length > 0)
		{
			rootMenuItems.push({
				text: Loc.getMessage('BIZPROC_AUTOMATION_ROBOT_CATEGORY_CLIENT'),
				items: menuItems['client']
			});
		}
		if (menuItems['ads'].length > 0)
		{
			rootMenuItems.push({
				text: Loc.getMessage('BIZPROC_AUTOMATION_ROBOT_CATEGORY_ADS'),
				items: menuItems['ads']
			});
		}
		rootMenuItems.push({
			text: Loc.getMessage('BIZPROC_AUTOMATION_ROBOT_CATEGORY_OTHER'),
			items: menuItems['other']
		});

		MenuManager.show(
			menuId,
			button,
			rootMenuItems,
			{
				autoHide: true,
				offsetLeft: (BX.pos(button)['width'] / 2),
				angle: { position: 'top', offset: 0 },
				maxHeight: 550
			}
		);
	}

	onChangeRobotClick(event)
	{
		this.onAddButtonClick(event.target, {changeRobot: true});
	}

	onExternalEditTemplateButtonClick(button)
	{
		if (!this.canEdit())
		{
			HelpHint.showNoPermissionsHint(button);
			return;
		}
		if (!getGlobalContext().bizprocEditorUrl.length)
		{
			if (top.BX.UI && top.BX.UI.InfoHelper)
			{
				top.BX.UI.InfoHelper.show('limit_office_bp_designer');
			}

			return;
		}

		const templateId = this.getTemplateId();
		if (templateId > 0)
		{
			this.openBizprocEditor(templateId);
		}
	}

	onUnsetExternalModifiedClick(button)
	{
		this.#templateNode = null;

		this.markExternalModified(false);
		this.markModified();
		this.reInit(null, this.#viewMode.intoRaw());
	}

	openBizprocEditor(templateId)
	{
		top.window.location.href = getGlobalContext().bizprocEditorUrl.replace('#ID#', templateId)
	}

	addRobot(robotData, callback)
	{
		const robot = new Robot({
			document: getGlobalContext().document,
			template: this,
			isFrameMode: getGlobalContext().get('isFrameMode'),
			tracker: this.#tracker,
		});
		const initData = {
			Type: robotData['CLASS'],
			Properties: {
				Title: robotData['NAME']
			}
		};

		if (this.#robots.length > 0)
		{
			const parentRobot = this.#robots[this.#robots.length - 1];
			if (!parentRobot.getDelayInterval().isNow() || parentRobot.isExecuteAfterPrevious())
			{
				initData['Delay'] = parentRobot.getDelayInterval().serialize();
				initData['ExecuteAfterPrevious'] =  1;
			}
		}

		robot.init(initData, this.#viewMode);
		robot.draft = true;
		if (callback)
		{
			callback.call(this, robot);
		}
	}

	insertRobot(robot, beforeRobot)
	{
		if (beforeRobot)
		{
			for (let i = 0; i < this.#robots.length; ++i)
			{
				if (this.#robots[i] !== beforeRobot)
				{
					continue;
				}

				this.#robots.splice(i, 0, robot);
				break;
			}
		}
		else
		{
			this.#robots.push(robot);
		}

		this.markModified();
	}

	getNextRobot(robot)
	{
		for (let i = 0; i < this.#robots.length; ++i)
		{
			if (this.#robots[i] === robot)
			{
				return (this.#robots[i + 1] || null);
			}
		}

		return null;
	}

	deleteRobot(robot, callback)
	{
		for(let i = 0; i < this.#robots.length; ++i)
		{
			if (this.#robots[i].isEqual(robot))
			{
				this.#robots.splice(i, 1);
				break;
			}
		}

		if (callback)
		{
			callback(robot);
		}

		this.markModified();
		this.updateTopButtonsVisibility();
	}

	insertRobotNode(robotNode, beforeNode)
	{
		if (beforeNode)
		{
			this.#listNode.insertBefore(robotNode, beforeNode);
		}
		else
		{
			this.#listNode.appendChild(robotNode);
		}

		this.updateTopButtonsVisibility();
	}

	openRobotSettingsDialog(robot: Robot, context?: Object, saveCallback: (Robot) => void)
	{
		if (!Type.isPlainObject(context))
		{
			context = {};
		}

		if (Designer.getInstance().getRobotSettingsDialog())
		{
			if (context.changeRobot)
			{
				Designer.getInstance().getRobotSettingsDialog().popup.close();
			}
			else
			{
				return;
			}
		}

		const formName = 'bizproc_automation_robot_dialog';

		const form = Dom.create('form', {
			props: {
				name: formName
			}
		});

		Designer.getInstance().setRobotSettingsDialog({
			template: this,
			context: context,
			robot: robot,
			form: form
		});

		form.appendChild(this.renderDelaySettings(robot));
		form.appendChild(this.renderConditionSettings(robot));
		if (robot.hasBrokenLink())
		{
			form.appendChild(this.renderBrokenLinkAlert());
		}

		const iconHelp = Dom.create('div', {
			attrs: { className: 'bizproc-automation-robot-help' },
			events: {
				click: (event) => this.emit('Template:help:show', event)
			},
		});
		form.appendChild(iconHelp);
		context['DOCUMENT_CATEGORY_ID'] = getGlobalContext().document.getCategoryId();

		BX.ajax({
			method: 'POST',
			dataType: 'html',
			url: getGlobalContext().ajaxUrl,
			data: {
				ajax_action: 'get_robot_dialog',
				document_signed: getGlobalContext().signedDocument,
				document_status: getGlobalContext().document.getCurrentStatusId(),
				context: context,
				robot_json: Helper.toJsonString(robot.serialize()),
				form_name: formName
			},
			onsuccess: html => {
				if (html)
				{
					const dialogRows = Dom.create('div', {
						html: html
					});
					form.appendChild(dialogRows);
				}

				this.showRobotSettingsPopup(robot, form, saveCallback);
			}
		});
	}

	showRobotSettingsPopup(robot: Robot, form: HTMLFormElement, saveCallback: (Robot) => void)
	{
		let popupMinWidth = 580;
		let popupWidth = popupMinWidth;

		if (this.#userOptions)
		{
			this.emit('Template:robot:showSettings');
			popupWidth = parseInt(
				this.#userOptions.get('defaults', 'robot_settings_popup_width', 580)
			);
		}

		this.initRobotSettingsControls(robot, form);

		if (
			robot.data.Type === 'CrmSendEmailActivity'
			|| robot.data.Type === 'MailActivity'
			|| robot.data.Type === 'RpaApproveActivity'
		)
		{
			popupMinWidth += 170;
			if (popupWidth < popupMinWidth)
			{
				popupWidth = popupMinWidth;
			}
		}

		let titleBar;
		const robotTitle =
			robot.hasTitle()
				? robot.getTitle()
				: Loc.getMessage('BIZPROC_AUTOMATION_ROBOT_SETTINGS_TITLE')
		;

		if (robot.draft)
		{
			titleBar = this.createChangeRobotTitleBar(robotTitle);
		}

		const me = this;
		const popup = new BX.PopupWindow(Helper.generateUniqueId(), null, {
			titleBar: titleBar || robotTitle,
			content: form,
			closeIcon: true,
			width: popupWidth,
			resizable: {
				minWidth: popupMinWidth,
				minHeight: 100
			},
			offsetLeft: 0,
			offsetTop: 0,
			closeByEsc: true,
			draggable: {restrict: false},
			events: {
				onPopupClose: popup => {
					this.currentRobot = null;
					Designer.getInstance().setRobotSettingsDialog(null);
					this.destroyRobotSettingsControls();
					popup.destroy();
					this.emit('Template:robot:closeSettings');
				},
				onPopupResize: () => {
					this.onResizeRobotSettings();
				},
				onPopupResizeEnd: function() {
					if (me.#userOptions)
					{
						me.#userOptions.set(
							'defaults',
							'robot_settings_popup_width',
							this.getWidth()
						);
					}
				}
			},
			buttons: [
				new BX.PopupWindowButton({
					text : Loc.getMessage('JS_CORE_WINDOW_SAVE'),
					className : "popup-window-button-accept",
					events : {
						click()
						{
							me.saveRobotSettings(form, robot, BX.delegate(function()
							{
								this.popupWindow.close();
								me.emit('Template:robot:add', {robot});
								if (saveCallback)
								{
									saveCallback(robot);
								}
							}, this), this.buttonNode);
						}
					}
				}),
				new BX.PopupWindowButtonLink({
					text : Loc.getMessage('JS_CORE_WINDOW_CANCEL'),
					className : "popup-window-button-link-cancel",
					events : {
						click: function(){
							this.popupWindow.close();
						}
					}
				})
			]
		});

		this.currentRobot = robot;
		Designer.getInstance().getRobotSettingsDialog().popup = popup;
		popup.show();
	}

	createChangeRobotTitleBar(title)
	{
		return {
			content: BX.Dom.create('div', {
			props: {
				className: 'popup-window-titlebar-text bizproc-automation-popup-titlebar-with-link'
			},
			children: [
				document.createTextNode(title),
				Dom.create('span', {
					props: {
						className: 'bizproc-automation-popup-titlebar-link'
					},
					text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_CHANGE_ROBOT'),
					events: {
						click: this.onChangeRobotClick.bind(this)
					}
				}),
			]
			})
		};
	}

	initRobotSettingsControls(robot, node)
	{
		if (!Type.isArray(this.robotSettingsControls))
		{
			this.robotSettingsControls = [];
		}

		const controlNodes = node.querySelectorAll('[data-role]');
		for (let i = 0; i < controlNodes.length; ++i)
		{
			this.initRobotSettingsControl(robot, controlNodes[i]);
		}
	}

	initRobotSettingsControl(robot, controlNode)
	{
		if (!Type.isArray(this.robotSettingsControls))
		{
			this.robotSettingsControls = [];
		}

		let control = null;
		const role = controlNode.getAttribute('data-role');

		if (role === 'user-selector')
		{
			control = new this.#selectors.userSelector(robot, controlNode, this.#data);
		}
		else if (role === 'file-selector')
		{
			control = new this.#selectors.fileSelector(robot, controlNode);
		}
		else if (role === 'inline-selector-target')
		{
			control = new this.#selectors.inlineSelector(robot, controlNode, this.#data);
		}
		else if (role === 'inline-selector-html')
		{
			control = new this.#selectors.inlineSelectorHtml(robot, controlNode);
		}
		else if (role === 'time-selector')
		{
			control = new this.#selectors.timeSelector(controlNode);
		}
		else if (role === 'save-state-checkbox')
		{
			control = new this.#selectors.saveStateCheckbox(controlNode, robot);
		}

		BX.UI.Hint.init(controlNode);

		if (control)
		{
			this.robotSettingsControls.push(control);
		}
	}

	destroyRobotSettingsControls()
	{
		if (this.conditionSelector)
		{
			this.conditionSelector.destroy();
			this.conditionSelector = null;
		}

		if (Type.isArray(this.robotSettingsControls))
		{
			for (let i = 0; i < this.robotSettingsControls.length; ++i)
			{
				if (Type.isFunction(this.robotSettingsControls[i].destroy))
				{
					this.robotSettingsControls[i].destroy();
				}
			}
		}

		this.robotSettingsControls = null;
	}

	onBeforeSaveRobotSettings()
	{
		if (Type.isArray(this.robotSettingsControls))
		{
			for (let i = 0; i < this.robotSettingsControls.length; ++i)
			{
				if (Type.isFunction(this.robotSettingsControls[i].onBeforeSave))
				{
					this.robotSettingsControls[i].onBeforeSave();
				}
			}
		}
	}

	onResizeRobotSettings()
	{
		if (Type.isArray(this.robotSettingsControls))
		{
			for (let i = 0; i < this.robotSettingsControls.length; ++i)
			{
				if (Type.isFunction(this.robotSettingsControls[i].onPopupResize))
				{
					this.robotSettingsControls[i].onPopupResize();
				}
			}
		}
	}

	renderDelaySettings(robot)
	{
		const delay = robot.getDelayInterval().clone();
		const idSalt = Helper.generateUniqueId();

		const delayTypeNode = Dom.create("input", {
			attrs: {
				type: "hidden",
				name: "delay_type",
				value: delay.type
			}
		});
		const delayValueNode = Dom.create("input", {
			attrs: {
				type: "hidden",
				name: "delay_value",
				value: delay.value
			}
		});
		const delayValueTypeNode = Dom.create("input", {
			attrs: {
				type: "hidden",
				name: "delay_value_type",
				value: delay.valueType
			}
		});
		const delayBasisNode = Dom.create("input", {
			attrs: {
				type: "hidden",
				name: "delay_basis",
				value: delay.basis
			}
		});
		const delayWorkTimeNode = Dom.create("input", {
			attrs: {
				type: "hidden",
				name: "delay_worktime",
				value: delay.workTime ? 1 : 0
			}
		});

		const delayIntervalLabelNode = Dom.create("span", {
			attrs: {
				className: "bizproc-automation-popup-settings-link bizproc-automation-delay-interval-basis"
			}
		});

		const basisFields = [];

		const docFields = getGlobalContext().document.getFields();
		const minLimitM = this.#delayMinLimitM;

		if (Type.isArray(docFields))
		{
			for (let i = 0; i < docFields.length; ++i)
			{
				const field = docFields[i];
				if (field['Type'] == 'date' || field['Type'] == 'datetime')
				{
					basisFields.push(field);
				}
			}
		}

		const delayIntervalSelector = new DelayIntervalSelector({
			labelNode: delayIntervalLabelNode,
			onchange(delay) {
				delayTypeNode.value = delay.type;
				delayValueNode.value = delay.value;
				delayValueTypeNode.value = delay.valueType;
				delayBasisNode.value = delay.basis;
				delayWorkTimeNode.value = delay.workTime ? 1 : 0;
			},
			basisFields: basisFields,
			minLimitM: minLimitM,
			useAfterBasis: true
		});

		let executeAfterPreviousBlock = null;
		if (robot.hasTemplate())
		{
			const executeAfterPreviousCheckbox = Dom.create("input", {
				attrs: {
					type: "checkbox",
					id: "param-group-3-1" + idSalt,
					name: "execute_after_previous",
					value: '1',
					style: 'vertical-align: middle'
				}
			});
			if (robot.isExecuteAfterPrevious())
			{
				executeAfterPreviousCheckbox.setAttribute('checked', 'checked');
			}
			executeAfterPreviousBlock = Dom.create("div", {
				attrs: { className: "bizproc-automation-popup-settings-block" },
				children: [
					executeAfterPreviousCheckbox,
					Dom.create("label", {
						attrs: {
							for: "param-group-3-1" + idSalt,
							style: 'color: #535C69'
						},
						text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_AFTER_PREVIOUS_WIDE')
					})
				]
			})
		}

		const div = Dom.create("div", {
			attrs: { className: "bizproc-automation-popup-settings bizproc-automation-popup-settings-flex" },
			children: [
				Dom.create("div", {
					attrs: { className: "bizproc-automation-popup-settings-block bizproc-automation-popup-settings-block-flex" },
					children: [
						Dom.create("span", {
							attrs: { className: "bizproc-automation-popup-settings-title-wrapper" },
							children: [
								delayTypeNode,
								delayValueNode,
								delayValueTypeNode,
								delayBasisNode,
								delayWorkTimeNode,
								Dom.create("span", {
									attrs: { className: "bizproc-automation-popup-settings-title bizproc-automation-popup-settings-title-left" },
									text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_TO_EXECUTE') + ":"
								}),
								delayIntervalLabelNode
							]
						})
					]
				}),
				executeAfterPreviousBlock
			]
		});

		delayIntervalSelector.init(delay);

		return div;
	}

	setDelaySettingsFromForm(formFields,  robot)
	{
		const delay = new DelayInterval();
		delay.setType(formFields['delay_type']);
		delay.setValue(formFields['delay_value']);
		delay.setValueType(formFields['delay_value_type']);
		delay.setBasis(formFields['delay_basis']);
		delay.setWorkTime(formFields['delay_worktime'] === '1');
		robot.setDelayInterval(delay);

		if (robot.hasTemplate())
		{
			robot.setExecuteAfterPrevious(
				formFields['execute_after_previous'] && (formFields['execute_after_previous']) === '1'
			);
		}

		return this;
	}

	renderConditionSettings(robot)
	{
		const conditionGroup = robot.getCondition();
		const selector = this.conditionSelector = new ConditionGroupSelector(conditionGroup, {
			fields: getGlobalContext().document.getFields(),
		});

		return Dom.create("div", {
			attrs: { className: "bizproc-automation-popup-settings" },
			children: [
				Dom.create("div", {
					attrs: { className: "bizproc-automation-popup-settings-block" },
					children: [
						Dom.create("span", {
							attrs: { className: "bizproc-automation-popup-settings-title" },
							text: Loc.getMessage('BIZPROC_AUTOMATION_ROBOT_CONDITION') + ":"
						}),
						selector.createNode(),
					],
				})
			]
		});
	}

	setConditionSettingsFromForm(formFields, robot)
	{
		robot.setCondition(ConditionGroup.createFromForm(formFields));

		return this;
	}

	renderBrokenLinkAlert()
	{
		const alert = Dom.create('div', {
			attrs: {className:'ui-alert ui-alert-warning ui-alert-icon-info ui-alert-xs'}
		});

		const message = Dom.create('span', {
			attrs: {className: 'ui-alert-message'},
			text: Loc.getMessage('BIZPROC_AUTOMATION_BROKEN_LINK_MESSAGE_ERROR')
		});

		alert.appendChild(message);
		alert.appendChild(Dom.create('span', {
			attrs: {className: 'ui-alert-close-btn'},
			events: {
				click() {
					alert.style.display = 'none';
				}
			}
		}));

		return alert;
	}

	saveRobotSettings(form, robot, callback, btnNode)
	{
		if (btnNode)
		{
			btnNode.classList.add('popup-window-button-wait');
		}

		this.onBeforeSaveRobotSettings();
		const formData = BX.ajax.prepareForm(form);

		const ajaxUrl = getGlobalContext().ajaxUrl;
		const documentSigned = getGlobalContext().signedDocument;
		BX.ajax({
			method: 'POST',
			dataType: 'json',
			url: ajaxUrl,
			data: {
				ajax_action: 'save_robot_settings',
				document_signed: documentSigned,
				robot_json: Helper.toJsonString(robot.serialize()),
				form_data_json: Helper.toJsonString(formData['data']),
				form_data: formData['data'], /** @bug 0135641 */
			},
			onsuccess: response => {
				if (btnNode)
				{
					btnNode.classList.remove('popup-window-button-wait');
				}

				if (response.SUCCESS)
				{
					robot.updateData(response.DATA.robot);
					this.setDelaySettingsFromForm(formData['data'], robot);
					this.setConditionSettingsFromForm(formData['data'], robot);

					if (robot.draft)
					{
						this.#robots.push(robot);
						this.insertRobotNode(robot.node)
					}
					robot.draft = false;

					robot.reInit();
					this.markModified();
					if (callback)
					{
						callback(response.DATA)
					}
				}
				else
				{
					alert(response.ERRORS[0]);
				}
			}
		});
	}

	serialize()
	{
		const data = BX.clone(this.#data);
		data['IS_EXTERNAL_MODIFIED'] = this.isExternalModified() ? 1 : 0;
		data['ROBOTS'] = [];

		for (let i = 0; i < this.#robots.length; ++i)
		{
			data['ROBOTS'].push(this.#robots[i].serialize());
		}

		return data;
	}

	isExternalModified()
	{
		return (this.externalModified === true);
	}

	markExternalModified(modified)
	{
		this.externalModified = modified !== false;
	}

	getRobotById(id)
	{
		return this.#robots.find(robot => robot.getId() === id);
	}

	isModified()
	{
		return this.modified;
	}

	markModified(modified)
	{
		this.modified = modified !== false;

		if (this.modified)
		{
			this.emit('Template:modified');
		}
	}

	getConstants()
	{
		const constants = [];

		Object.keys(this.#data.CONSTANTS).forEach(id => {
			const constant = BX.clone(this.#data.CONSTANTS[id]);

			constant.Id = id;
			constant.ObjectId = 'Constant';
			constant.SystemExpression = '{=Constant:' + id + '}';
			constant.Expression = '{{~&:' + id + '}}';

			constants.push(constant);
		});

		return constants;
	}

	getConstant(id)
	{
		const constants = this.getConstants();

		for (let i = 0; i < constants.length; ++i)
		{
			if (constants[i].Id === id)
			{
				return constants[i];
			}
		}

		return null;
	}

	addConstant(property)
	{
		const id = property.Id || this.generatePropertyId('Constant', this.#data.CONSTANTS);

		if (this.#data.CONSTANTS[id])
		{
			throw `Constant with id "${id}" is already exists`;
		}

		this.#data.CONSTANTS[id] = property;

		this.emit('Template:constant:add');
		// if (this.component)
		// {
		// 	BX.onCustomEvent(this.component, 'onTemplateConstantAdd', [this, this.getConstant(id)]);
		// }

		return this.getConstant(id);
	}

	updateConstant(id, property)
	{
		if (!this.#data.CONSTANTS[id])
		{
			throw `Constant with id "${id}" does not exists`;
		}

		//TODO: only Description yet.
		this.#data.CONSTANTS[id].Description = property.Description;

		this.emit('Template:constant:update', {constant: this.getConstant(id)});
		// if (this.component)
		// {
		// 	BX.onCustomEvent(this.component, 'onTemplateConstantUpdate', [this, this.getConstant(id)]);
		// }

		return this.getConstant(id);
	}

	deleteConstant(id)
	{
		delete this.#data.CONSTANTS[id];

		return true;
	}

	setConstantValue(id, value)
	{
		if (this.#data.CONSTANTS[id])
		{
			this.#data.CONSTANTS[id]['Default'] = value;

			return true;
		}

		return false;
	}

	getParameters()
	{
		const params = [];

		Object.keys(this.#data.PARAMETERS).forEach(id => {
			const param = BX.clone(this.#data.PARAMETERS[id]);

			param.Id = id;
			param.ObjectId = 'Template';
			param.SystemExpression = '{=Template:' + id + '}';
			param.Expression = '{{~*:' + id + '}}';

			params.push(param);
		});

		return params;
	}

	getParameter(id)
	{
		const params = this.getParameters();

		for (let i = 0; i < params.length; ++i)
		{
			if (params[i].Id === id)
			{
				return params[i];
			}
		}

		return null;
	}

	addParameter(property)
	{
		const id = property.Id || this.generatePropertyId('Parameter', this.#data.PARAMETERS);

		if (this.#data.PARAMETERS[id])
		{
			throw `Parameter with id "${id}" is already exists`;
		}

		this.#data.PARAMETERS[id] = property;

		this.emit('Template:parameter:add', {parameter: this.getParameter(id)});
		// if (this.component)
		// {
		// 	BX.onCustomEvent(this.component, 'onTemplateParameterAdd', [this, this.getParameter(id)]);
		// }

		return this.getParameter(id);
	}

	updateParameter(id, property)
	{
		if (!this.#data.PARAMETERS[id])
		{
			throw `Parameter with id "${id}" does not exists`;
		}

		//TODO: only Description yet.
		this.#data.PARAMETERS[id].Description = property.Description;

		this.emit('Template:parameter:update', {parameter: this.getParameter(id)});
		// if (this.component)
		// {
		// 	BX.onCustomEvent(this.component, 'onTemplateParameterUpdate', [this, this.getParameter(id)]);
		// }

		return this.getParameter(id);
	}

	deleteParameter(id)
	{
		delete this.#data.PARAMETERS[id];

		return true;
	}

	setParameterValue(id, value)
	{
		if (this.#data.PARAMETERS[id])
		{
			this.#data.PARAMETERS[id]['Default'] = value;

			return true;
		}

		return false;
	}

	getVariables()
	{
		const variables = [];

		Object.keys(this.#data.VARIABLES).forEach(id => {
			const variable = BX.clone(this.#data.VARIABLES[id]);

			variable.Id = id;
			variable.ObjectId = 'Variable';
			variable.SystemExpression = '{=Variable:' + id + '}';
			variable.Expression = '{=Variable:' + id + '}';

			variables.push(variable);
		});

		return variables;
	}

	generatePropertyId(prefix, existsList)
	{
		let index;
		for(index = 1; index <= 1000; ++index)
		{
			if (!existsList[prefix + index])
			{
				break; //found
			}
		}

		return prefix + index;
	}

	collectUsages()
	{
		const usages = {
			Document: new Set(),
			Constant: new Set(),
			Variable: new Set(),
			Parameter: new Set(),
			GlobalConstant: new Set(),
			GlobalVariable: new Set(),
			Activity: new Set()
		};

		this.#robots.forEach(robot => {
			const robotUsages = robot.collectUsages();

			Object.keys(usages).forEach(key => {
				robotUsages[key].forEach(usage => {
					if (!usages[key].has(usage))
					{
						usages[key].add(usage);
					}
				});
			});
		});

		return usages;
	}

	subscribeRobotEvents(eventName: string, listener: (BaseEvent) => void): this
	{
		this.#robots.forEach(robot => robot.subscribe(eventName, listener))

		return this;
	}

	unsubscribeRobotEvents(eventName: string, listener: (BaseEvent) => void)
	{
		this.#robots.forEach(robot => robot.unsubscribe(eventName, listener));

		return this;
	}

	getRobotDescription(type: string): ?object
	{
		return getGlobalContext().availableRobots.find(item => item['CLASS'] === type);
	}

	setGlobalVariables(globalVariables: Array = []): this
	{
		this.globalVariables = globalVariables;

		return this;
	}

	setGlobalConstants(globalConstants: Array = []): this
	{
		this.globalConstants = globalConstants;

		return this;
	}
}