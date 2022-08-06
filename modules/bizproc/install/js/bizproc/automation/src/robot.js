import { Dom, Type, Event, Text, Loc } from 'main.core';
import { EventEmitter } from 'main.core.events';
import { Document } from './document/document';
import { Template } from './template';
import { DelayInterval } from './delay-interval';
import { ViewMode } from './view-mode';
import { HelpHint } from './help-hint';
import { ConditionGroup } from 'bizproc.automation';
import { Tracker } from './tracker/tracker'
import { TrackingStatus } from './tracker/types';

export class Robot extends EventEmitter
{
	SYSTEM_EXPRESSION_PATTERN = '\\{=\\s*(?<object>[a-z0-9_]+)\\s*\\:\\s*(?<field>[a-z0-9_\\.]+)(\\s*>\\s*(?<mod1>[a-z0-9_\\:]+)(\\s*,\\s*(?<mod2>[a-z0-9_]+))?)?\\s*\\}';

	#data: Object<string, any>;
	#document: Document;
	#template: ?Template;
	#tracker: ?Object;
	#delay: DelayInterval;
	#node: HTMLElement;
	#condition: ConditionGroup;
	#isDraft: boolean;

	#isFrameMode: boolean;
	#viewMode: ViewMode;

	constructor(params: {
		document: Document,
		template: ?Template,
		isFrameMode: boolean,
		tracker: Tracker,
	})
	{
		super();
		this.setEventNamespace('BX.Bizproc.Automation');

		this.#document = params.document;
		if (!Type.isNil(params.template))
		{
			this.#template = params.template;
		}
		this.#isFrameMode = params.isFrameMode;
		this.#viewMode = ViewMode.none();
		this.#tracker = params.tracker;
		this.#isDraft = false;

		this.#delay = new DelayInterval();
	}

	get node()
	{
		return this.#node;
	}

	get data()
	{
		return this.#data;
	}

	get draft()
	{
		return this.#isDraft;
	}

	set draft(draft: boolean)
	{
		this.#isDraft = draft;
	}

	get template()
	{
		return this.#template;
	}

	hasTemplate(): boolean
	{
		return !Type.isNil(this.#template);
	}

	getTemplate(): ?Template
	{
		return this.#template;
	}

	getDocument(): Document
	{
		return this.#document;
	}

	static generateName(): string
	{
		return (
			'A' + parseInt(Math.random() * 100000)
			+ '_' + parseInt(Math.random() * 100000)
			+ '_' + parseInt(Math.random() * 100000)
			+ '_' + parseInt(Math.random() * 100000)
		);
	}

	clone(): Robot
	{
		const clonedRobot = new Robot({
			document: this.#document,
			template: this.#template,
			isFrameMode: this.#isFrameMode,
			tracker: this.#tracker,
		});

		const robotData = {
			Name: Robot.generateName(),
			Delay: this.getDelayInterval().clone(),
			Condition: this.getCondition().clone(),
			...BX.clone(this.#data)
		};
		clonedRobot.init(robotData, this.#viewMode);

		return clonedRobot;
	}

	isEqual(other: Robot): boolean
	{
		return this.#data.Name === other.#data.Name;
	}

	init(data: Object, viewMode: ?ViewMode): void
	{
		if (Type.isPlainObject(data))
		{
			this.#data = data;
		}
		if (!this.#data.Name)
		{
			this.#data.Name = Robot.generateName();
		}

		this.#delay = new DelayInterval(this.#data.Delay);
		this.#condition = new ConditionGroup(this.#data.Condition);
		if (!this.#data.Condition)
		{
			this.#condition.type = ConditionGroup.CONDITION_TYPE.Mixed;
		}
		this.#viewMode = Type.isNil(viewMode) ? ViewMode.edit() : viewMode;
		if (!this.#viewMode.isNone())
		{
			this.#node = this.createNode();
		}
	}

	reInit(data: Object, viewMode: ?ViewMode): void
	{
		if (Type.isNil(viewMode) && this.#viewMode.isNone())
		{
			return;
		}

		const node = this.#node;
		this.#node = this.createNode();
		if (node.parentNode)
		{
			node.parentNode.replaceChild(this.#node, node);
		}
	}

	destroy()
	{
		this.emit('Robot:destroyed');
	}

	canEdit(): boolean
	{
		return this.#template.canEdit();
	}

	getProperties(): Object
	{
		if (this.#data && Type.isPlainObject(this.#data.Properties))
		{
			return this.#data.Properties;
		}

		return {};
	}

	getProperty(name: string): ?Object
	{
		return this.getProperties()[name] || null;
	}

	hasProperty(name: string): boolean
	{
		return this.getProperties().hasOwnProperty(name);
	}

	setProperty(name: string, value: any): Robot
	{
		this.#data.Properties[name] = value;

		return this;
	}

	getId(): ?string
	{
		return this.#data.Name || null;
	}

	getLogStatus(): number
	{
		let status = TrackingStatus.WAITING;
		let log = this.#tracker.getRobotLog(this.getId());

		if (log)
		{
			status = log.status;
		}
		else if (this.#data.DelayName)
		{
			log = this.#tracker.getRobotLog(this.#data.DelayName);
			if (log && log.status === TrackingStatus.RUNNING)
			{
				status = TrackingStatus.RUNNING;
			}
		}

		return status;
	}

	getLogErrors(): Array<string>
	{
		let errors = [];
		const log = this.#tracker.getRobotLog(this.getId());
		if (log && log.errors)
		{
			errors = log.errors;
		}

		return errors;
	}

	getDelayNotes(): Array<string>
	{
		if (this.#data.DelayName)
		{
			const log = this.#tracker.getRobotLog(this.#data.DelayName);
			if (log && log.status === TrackingStatus.RUNNING)
			{
				return log.notes;
			}
		}

		return [];
	}

	selectNode(): void
	{
		if (this.#node)
		{
			Dom.addClass(this.#node, '--selected');
			this.emit('Robot:selected');
		}
	}

	unselectNode()
	{
		if (this.#node)
		{
			Dom.removeClass(this.#node, '--selected');
			this.emit('Robot:unselected');
		}
	}

	isSelected()
	{
		return this.#node && Dom.hasClass(this.#node, '--selected');
	}

	enableManageMode(isActive: boolean)
	{
		this.#viewMode = ViewMode.manage().setProperty('isActive', isActive);

		if (!isActive)
		{
			Dom.addClass(this.#node, '--locked-node');
		}

		const deleteButton = this.#node.querySelector('.bizproc-automation-robot-btn-delete');
		Dom.hide(deleteButton);

		this.#node.onclick = () => {
			if (!this.#viewMode.isManage() || !this.#viewMode.getProperty('isActive', false))
			{
				return;
			}

			if (!this.isSelected())
			{
				this.selectNode();
			}
			else
			{
				this.unselectNode();
			}
		};
	}

	disableManageMode()
	{
		this.#viewMode = ViewMode.edit();
		this.unselectNode();
		Dom.removeClass(this.#node, '--locked-node');

		const deleteButton = this.#node.querySelector('.bizproc-automation-robot-btn-delete');
		Dom.show(deleteButton);

		this.#node.onclick = undefined;
	}

	createNode(): HTMLElement
	{
		let wrapperClass = 'bizproc-automation-robot-container-wrapper';
		let containerClass = 'bizproc-automation-robot-container';

		if (this.#viewMode.isEdit() && this.canEdit())
		{
			wrapperClass += ' bizproc-automation-robot-container-wrapper-draggable';
		}

		const targetLabel = Loc.getMessage('BIZPROC_AUTOMATION_CMP_TO');
		const targetNode = Dom.create("a", {
			attrs: {
				className: "bizproc-automation-robot-settings-name",
				title: Loc.getMessage('BIZPROC_AUTOMATION_CMP_AUTOMATICALLY')
			},
			text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_AUTOMATICALLY')
		});

		if (Type.isPlainObject(this.#data.viewData) && this.#data.viewData.responsibleLabel)
		{
			let labelText =
				this.#data.viewData.responsibleLabel
					.replace('{=Document:ASSIGNED_BY_ID}', Loc.getMessage('BIZPROC_AUTOMATION_CMP_RESPONSIBLE'))
					.replace('author', Loc.getMessage('BIZPROC_AUTOMATION_CMP_RESPONSIBLE'))
					.replace(/\{=Constant\:Constant[0-9]+\}/, Loc.getMessage('BIZPROC_AUTOMATION_ASK_CONSTANT'))
					.replace(/\{\{~&\:Constant[0-9]+\}\}/, Loc.getMessage('BIZPROC_AUTOMATION_ASK_CONSTANT'))
					.replace(/\{=Template\:Parameter[0-9]+\}/, Loc.getMessage('BIZPROC_AUTOMATION_ASK_PARAMETER'))
					.replace(/\{\{~&:\:Parameter[0-9]+\}\}/, Loc.getMessage('BIZPROC_AUTOMATION_ASK_PARAMETER'))
			;

			if (labelText.indexOf('{=Document') >= 0)
			{
				this.#document.getFields().forEach(field => {
					labelText = labelText.replace(field['SystemExpression'], field['Name']);
				});
			}

			if (labelText.indexOf('{=A') >= 0)
			{
				this.#template.robots.forEach(robot => {
					robot.getReturnFieldsDescription().forEach(field => {
						if (field['Type'] === 'user')
						{
							labelText = labelText.replace(
								field['SystemExpression'],
								robot.getTitle() + ': ' + field['Name']
							);
						}
					});
				});
			}

			targetNode.textContent = labelText;
			targetNode.setAttribute('title', labelText);

			if (this.#data.viewData.responsibleUrl)
			{
				targetNode.href = this.#data.viewData.responsibleUrl;
				if (this.#isFrameMode)
				{
					targetNode.setAttribute('target', '_blank');
				}
			}

			if (parseInt(this.#data.viewData.responsibleId) > 0)
			{
				targetNode.setAttribute('bx-tooltip-user-id', this.#data.viewData.responsibleId);
			}
		}

		let delayLabel = this.getDelayInterval().format(
			Loc.getMessage('BIZPROC_AUTOMATION_CMP_AT_ONCE'),
			this.#document.getFields()
		);

		if (this.isExecuteAfterPrevious())
		{
			delayLabel = (delayLabel !== Loc.getMessage('BIZPROC_AUTOMATION_CMP_AT_ONCE')) ? delayLabel + ', ' : '';
			delayLabel += Loc.getMessage('BIZPROC_AUTOMATION_CMP_AFTER_PREVIOUS');
		}

		if (this.getCondition().items.length > 0)
		{
			delayLabel += ', ' + Loc.getMessage('BIZPROC_AUTOMATION_CMP_BY_CONDITION');
		}

		const delayNode = Dom.create(
			this.#viewMode.isEdit() ? "a" : "span",
			{
				attrs: {
					className: this.#viewMode.isEdit() ? 'bizproc-automation-robot-link' : 'bizproc-automation-robot-text',
					title: delayLabel
				},
				text: delayLabel,
			}
		);

		const statusNode = Dom.create("div", {
			attrs: {
				className: "bizproc-automation-robot-information"
			}
		});
		this.subscribeOnce('Robot:destroyed', () => {
			if (HelpHint.isBindedToNode(statusNode))
			{
				HelpHint.hideHint();
			}
		})

		switch (this.getLogStatus())
		{
			case TrackingStatus.RUNNING:
				if (this.#document.getCurrentStatusId() === this.#template.getStatusId())
				{
					statusNode.classList.add('--loader');

					const delayNotes = this.getDelayNotes();
					if (delayNotes.length)
					{
						statusNode.setAttribute('data-text', delayNotes.join('\n'));
						HelpHint.bindToNode(statusNode);
					}
				}
				break;
			case TrackingStatus.COMPLETED:
			case TrackingStatus.AUTOCOMPLETED:
				containerClass += ' --complete';
				statusNode.classList.add('--complete');
				break;
		}

		const errors = this.getLogErrors();
		if (errors.length > 0)
		{
			statusNode.classList.add('--errors');
			statusNode.setAttribute('data-text', errors.join('\n'));
			HelpHint.bindToNode(statusNode);
		}

		let titleClassName = 'bizproc-automation-robot-title-text';
		if (this.#viewMode.isEdit() && this.canEdit())
		{
			titleClassName += ' bizproc-automation-robot-title-text-editable';
		}

		const div = Dom.create("div", {
			attrs: {
				className: containerClass,
				'data-role': 'robot-container',
				'data-type': 'item-robot',
				'data-id': this.getId()
			},
			children: [
				Dom.create("div", {
					props: {
						className: "bizproc-automation-robot-container-checkbox"
					}
				}),
				Dom.create('div', {
					attrs: {
						className: wrapperClass
					},
					children: [
						Dom.create("div", {
							attrs: { className: "bizproc-automation-robot-deadline" },
							children: [delayNode]
						}),
						Dom.create("div", {
							attrs: {
								className: "bizproc-automation-robot-title"
							},
							children: [
								Dom.create("div", {
									attrs: {
										className: titleClassName
									},
									html: this.clipTitle(this.getTitle()),
									events: {
										click: event => {
											if (this.#viewMode.isEdit() && this.canEdit() && !this.#viewMode.isManage())
											{
												this.onTitleEditClick(event);
											}
										},
									}
								})
							]
						}),
						Dom.create("div", {
							attrs: { className: "bizproc-automation-robot-settings" },
							children: [
								Dom.create("div", {
									attrs: { className: "bizproc-automation-robot-settings-title" },
									text: targetLabel + ':'
								}),
								targetNode
							]
						}),
						statusNode,
					]
				})
			]
		});

		if (this.canEdit())
		{
			this.registerItem(div);
		}

		if (this.#viewMode.isEdit())
		{
			const deleteBtn = Dom.create('SPAN', {
				attrs: {
					className: 'bizproc-automation-robot-btn-delete'
				}
			});
			Event.bind(deleteBtn, 'click', this.onDeleteButtonClick.bind(this, deleteBtn));
			div.lastChild.appendChild(deleteBtn);

			const copyBtn = Dom.create('div', {
				attrs: {
					className: 'bizproc-automation-robot-btn-copy'
				},
				text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_COPY') || 'copy'
			});
			Event.bind(copyBtn, 'click', this.onCopyButtonClick.bind(this, copyBtn));
			div.appendChild(copyBtn);

			const settingsBtn = Dom.create('div', {
				attrs: {
					className: 'bizproc-automation-robot-btn-settings'
				},
				text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_EDIT')
			});
			Event.bind(div, 'click', this.onSettingsButtonClick.bind(this, div));

			div.appendChild(settingsBtn);
		}

		return div;
	}

	onDeleteButtonClick(button, event)
	{
		event.stopPropagation();

		if (!this.canEdit())
		{
			HelpHint.showNoPermissionsHint(button);
		}
		else if (!this.#viewMode.isManage())
		{
			Dom.remove(this.#node);
			this.#template.deleteRobot(this);
		}
	}

	onSettingsButtonClick(button)
	{
		if (!this.canEdit())
		{
			HelpHint.showNoPermissionsHint(button);
		}
		else if (!this.#viewMode.isManage())
		{
			this.#template.openRobotSettingsDialog(this);
		}
	}

	onCopyButtonClick(button, event)
	{
		event.stopPropagation();

		if (!this.canEdit())
		{
			HelpHint.showNoPermissionsHint(button);
		}
		else if (!this.#viewMode.isManage())
		{
			const copiedRobot = this.clone();
			const robotTitle = copiedRobot.getProperty('Title');
			if (!Type.isNil(robotTitle))
			{
				const newTitle = robotTitle + ' ' + ' ' + Loc.getMessage('BIZPROC_AUTOMATION_CMP_COPY_CAPTION');
				copiedRobot.setProperty('Title', newTitle);
				copiedRobot.reInit();
			}

			Template.copyRobotTo(this.#template, copiedRobot, this.#template.getNextRobot(this));
		}
	}

	onTitleEditClick(e)
	{
		e.preventDefault();
		e.stopPropagation();

		const formName = 'bizproc_automation_robot_title_dialog';

		const form = Dom.create('form', {
			props: {
				name: formName
			},
			style: {"min-width": '540px'}
		});

		form.appendChild(Dom.create("span", {
			attrs: { className: "bizproc-automation-popup-settings-title bizproc-automation-popup-settings-title-autocomplete" },
			text: Loc.getMessage('BIZPROC_AUTOMATION_CMP_ROBOT_NAME') + ':'
		}));

		form.appendChild(Dom.create("div", {
			attrs: { className: "bizproc-automation-popup-settings" },
			children: [BX.create("input", {
				attrs: {
					className: 'bizproc-automation-popup-input',
					type: "text",
					name: "name",
					value: this.getTitle()
				}
			})]
		}));

		this.emit('Robot:title:editStart');

		const self = this;
		const popup = new BX.PopupWindow(BX.Bizproc.Helper.generateUniqueId(), null, {
			titleBar: Loc.getMessage('BIZPROC_AUTOMATION_CMP_ROBOT_NAME'),
			content: form,
			closeIcon: true,
			offsetLeft: 0,
			offsetTop: 0,
			closeByEsc: true,
			draggable: {restrict: false},
			overlay: false,
			events: {
				onPopupClose(popup)
				{
					popup.destroy();
					self.emit('Robot:title:editCompleted');
				}
			},
			buttons: [
				new BX.PopupWindowButton({
					text : Loc.getMessage('JS_CORE_WINDOW_SAVE'),
					className : "popup-window-button-accept",
					events : {
						click()
						{
							const nameNode = form.elements.name;
							self.setProperty('Title', nameNode.value);
							self.reInit();
							self.#template.markModified();
							this.popupWindow.close();
						}
					}
				}),
				new BX.PopupWindowButtonLink({
					text : Loc.getMessage('JS_CORE_WINDOW_CANCEL'),
					className : "popup-window-button-link-cancel",
					events : {
						click()
						{
							this.popupWindow.close()
						}
					}
				})
			]
		});

		popup.show();
	}

	onSearch(event)
	{
		if (!this.#node)
		{
			return;
		}

		const query = event.getData().queryString;
		const match = !query || this.getTitle().toLowerCase().indexOf(query) >= 0;

		if (match)
		{
			Dom.removeClass(this.#node, '--search-mismatch');
		}
		else
		{
			Dom.addClass(this.#node, '--search-mismatch');
		}
	}

	clipTitle(fullTitle: string)
	{
		let title = Text.encode(fullTitle);
		const arrTitle = title.split(" ");
		const lastWord = "<span>" + arrTitle[arrTitle.length - 1] + "</span>";

		arrTitle.splice(arrTitle.length - 1);

		title = arrTitle.join(" ") + " " + lastWord;

		return title;
	}

	updateData(data)
	{
		if (Type.isPlainObject(data))
		{
			this.#data = data;
		}
		else
		{
			throw 'Invalid data';
		}
	}

	serialize()
	{
		const result = BX.clone(this.#data);
		delete result['viewData'];
		result.Delay = this.#delay.serialize();
		result.Condition = this.#condition.serialize();

		return result;
	}

	getDelayInterval(): DelayInterval
	{
		return this.#delay;
	}

	setDelayInterval(delay): Robot
	{
		this.#delay = delay;

		return this;
	}

	getCondition(): ConditionGroup
	{
		return this.#condition;
	}

	setCondition(condition)
	{
		this.#condition = condition;

		return this;
	}

	setExecuteAfterPrevious(flag)
	{
		this.#data.ExecuteAfterPrevious = flag ? 1 : 0;

		return this;
	}

	isExecuteAfterPrevious()
	{
		return (this.#data.ExecuteAfterPrevious === 1 || this.#data.ExecuteAfterPrevious === '1')
	}

	registerItem(object)
	{
		if (Type.isNil(object["__bxddid"]))
		{
			object.onbxdragstart = BX.proxy(this.dragStart, this);
			object.onbxdrag = BX.proxy(this.dragMove, this);
			object.onbxdragstop = BX.proxy(this.dragStop, this);
			object.onbxdraghover = BX.proxy(this.dragOver, this);
			jsDD.registerObject(object);
			jsDD.registerDest(object, 1);
		}
	}

	unregisterItem(object)
	{
		object.onbxdragstart = undefined;
		object.onbxdrag = undefined;
		object.onbxdragstop = undefined;
		object.onbxdraghover = undefined;
		jsDD.unregisterObject(object);
		jsDD.unregisterDest(object);
	}

	dragStart()
	{
		this.draggableItem = BX.proxy_context;

		if (!this.draggableItem)
		{
			jsDD.stopCurrentDrag();
			return;
		}

		if (!this.stub)
		{
			const itemWidth = this.draggableItem.offsetWidth;
			this.stub = this.draggableItem.cloneNode(true);
			this.stub.style.position = "absolute";
			this.stub.classList.add("bizproc-automation-robot-container-drag");
			this.stub.style.width = itemWidth + "px";
			document.body.appendChild(this.stub);
		}
	}

	dragMove(x,y)
	{
		this.stub.style.left = x + "px";
		this.stub.style.top = y + "px";
	}

	dragOver(destination, x, y)
	{
		if (this.droppableItem)
		{
			this.droppableItem.classList.remove("bizproc-automation-robot-container-pre");
		}

		if (this.droppableColumn)
		{
			this.droppableColumn.classList.remove("bizproc-automation-robot-list-pre");
		}

		const type = destination.getAttribute("data-type");

		if (type === "item-robot")
		{
			this.droppableItem = destination;
			this.droppableColumn = null;
		}

		if (type === "column-robot")
		{
			this.droppableColumn = destination.querySelector('[data-role="robot-list"]');
			this.droppableItem = null;
		}

		if (this.droppableItem)
		{
			this.droppableItem.classList.add("bizproc-automation-robot-container-pre");
		}

		if (this.droppableColumn)
		{
			this.droppableColumn.classList.add("bizproc-automation-robot-list-pre");
		}
	}

	dragStop(x, y, event)
	{
		event = event || window.event;
		const isCopy = event && (event.ctrlKey || event.metaKey);

		if (this.draggableItem)
		{
			if (this.droppableItem)
			{
				this.droppableItem.classList.remove("bizproc-automation-robot-container-pre");
				this.emit('Robot:manage', {
					templateNode: this.droppableItem.parentNode,
					isCopy,
					droppableItem: this.droppableItem,
					robot: this,
				});
			}
			else if (this.droppableColumn)
			{
				this.droppableColumn.classList.remove("bizproc-automation-robot-list-pre");
				this.emit('Robot:manage', {
					templateNode: this.droppableColumn,
					isCopy,
					robot: this,
				});
			}
		}

		this.stub.parentNode.removeChild(this.stub);
		this.stub = null;
		this.draggableItem = null;
		this.droppableItem = null;
	}

	moveTo(template, beforeRobot)
	{
		Dom.remove(this.#node);
		this.#template.deleteRobot(this);
		this.#template = template;

		this.#template.insertRobot(this, beforeRobot);
		this.#node = this.createNode();
		this.#template.insertRobotNode(this.#node, beforeRobot ? beforeRobot.node : null);
	}

	copyTo(template, beforeRobot)
	{
		const robot = new Robot({
			document: this.#document,
			template,
			isFrameMode: this.#isFrameMode,
			tracker: this.#tracker,
		});

		const robotData = this.serialize();
		delete robotData['Name'];
		delete robotData['DelayName'];

		robot.init(robotData, this.#viewMode);

		template.insertRobot(robot, beforeRobot);
		template.insertRobotNode(robot.node, beforeRobot ? beforeRobot.node : null);

		return robot;
	}

	getTitle()
	{
		return this.getProperty('Title') || this.getDescriptionTitle();
	}

	getDescriptionTitle()
	{
		let name = 'untitled';
		const description = this.template.getRobotDescription(this.#data['Type']);
		if (description['NAME'])
		{
			name = description['NAME'];
		}
		if (description['ROBOT_SETTINGS'] && description['ROBOT_SETTINGS']['TITLE'])
		{
			name = description['ROBOT_SETTINGS']['TITLE'];
		}

		return name;
	}

	hasTitle(): boolean
	{
		return this.getTitle() !== 'untitled';
	}

	getReturnFieldsDescription()
	{
		const fields = [];
		const description = this.template.getRobotDescription(this.#data['Type']);

		if (description && description['RETURN'])
		{
			for (const fieldId in description['RETURN'])
			{
				if (description['RETURN'].hasOwnProperty(fieldId))
				{
					const field = description['RETURN'][fieldId];
					fields.push({
						Id: fieldId,
						ObjectId: this.getId(),
						ObjectName: this.getTitle(),
						Name: field['NAME'],
						Type: field['TYPE'],
						Expression: '{{~'+this.getId()+':'+fieldId+' # '+this.getTitle()+': '+field['NAME']+'}}',
						SystemExpression: '{='+this.getId()+':'+fieldId+'}'
					});

					if (!this.appendPropertyMods)
					{
						continue;
					}

					//generate printable version
					if (
						field['TYPE'] === 'user'
						||
						field['TYPE'] === 'bool'
						||
						field['TYPE'] === 'file'
					)
					{
						const printableTag = (field['TYPE'] === 'user') ? 'friendly' : 'printable';
						fields.push({
							Id: fieldId + '_printable',
							ObjectId: this.getId(),
							Name: field['NAME'] + ' ' + Loc.getMessage('BIZPROC_AUTOMATION_CMP_MOD_PRINTABLE_PREFIX'),
							Type: 'string',
							Expression: `{{~${this.getId()}:${fieldId} > ${printableTag} # ${this.getTitle()}: ${field['NAME']}}}`,
							SystemExpression: `{=${this.getId()}:${fieldId}>${printableTag}}`,
						});
					}
				}
			}
		}
		if (description && Type.isArray(description['ADDITIONAL_RESULT']))
		{
			const props = this.#data['Properties'];

			description['ADDITIONAL_RESULT'].forEach(addProperty => {
				if (props[addProperty])
				{
					for (const fieldId in props[addProperty])
					{
						if (props[addProperty].hasOwnProperty(fieldId))
						{
							const field = props[addProperty][fieldId];
							fields.push({
								Id: fieldId,
								ObjectId: this.getId(),
								Name: field['Name'],
								Type: field['Type'],
								Options: field['Options'] || null,
								Expression: `{{~${this.getId()}:${fieldId} # ${this.getTitle()}: ${field['Name']}}}`,
								SystemExpression: '{=' + this.getId() + ':' + fieldId + '}',
							});

							//generate printable version
							if (
								field['Type'] === 'user'
								||
								field['Type'] === 'bool'
								||
								field['Type'] === 'file'
							)
							{
								const printableTag = (field['Type'] === 'user') ? 'friendly' : 'printable';
								const expression = `{{~${this.getId()}:${fieldId} > ${printableTag} # ${this.getTitle()}: ${field['Name']}}}`;
								fields.push({
									Id: fieldId + '_printable',
									ObjectId: this.getId(),
									Name: field['Name'] + ' ' + Loc.getMessage('BIZPROC_AUTOMATION_CMP_MOD_PRINTABLE_PREFIX'),
									Type: 'string',
									Expression: expression,
									SystemExpression: '{=' + this.getId() + ':' + fieldId + '>' + printableTag + '}',
								});
							}
						}
					}
				}
			});
		}

		return fields;
	}

	getReturnProperty(id): Array<Object>
	{
		const fields = this.getReturnFieldsDescription();
		for (let i = 0; i < fields.length; ++i)
		{
			if (fields[i]['Id'] === id)
			{
				return fields[i];
			}
		}

		return null;
	}

	collectUsages()
	{
		const properties = this.getProperties();
		const usages = {
			Document: new Set(),
			Constant: new Set(),
			Variable: new Set(),
			Parameter: new Set(),
			GlobalConstant: new Set(),
			GlobalVariable: new Set(),
			Activity: new Set()
		};

		Object.values(properties).forEach(property => this.collectExpressions(property, usages));

		const conditions = this.getCondition().serialize();
		conditions.items.forEach(item => this.collectParsedExpressions(item[0], usages));

		return usages;
	}

	collectExpressions(value, usages)
	{
		if (Type.isArray(value))
		{
			value.forEach(v => this.collectExpressions(v, usages));
		}
		else if (Type.isPlainObject(value))
		{
			Object.values(value).forEach(value => this.collectExpressions(value, usages));
		}
		else if (Type.isStringFilled(value))
		{
			let found;
			const systemExpressionRegExp = new RegExp(this.SYSTEM_EXPRESSION_PATTERN, 'ig');
			while ((found = systemExpressionRegExp.exec(value)) !== null)
			{
				this.collectParsedExpressions(found.groups, usages);
			}
		}
	}

	collectParsedExpressions(parsedUsage, usages)
	{
		if (Type.isPlainObject(parsedUsage) && parsedUsage['object'] && parsedUsage['field'])
		{
			switch (parsedUsage['object'])
			{
				case 'Document':
					usages.Document.add(parsedUsage['field']);
					return;

				case 'Constant':
					usages.Constant.add(parsedUsage['field']);
					return;

				case 'Variable':
					usages.Variable.add(parsedUsage['field']);
					return;

				case 'Template':
					usages.Parameter.add(parsedUsage['field']);
					return;

				case 'GlobalConst':
					usages.GlobalConstant.add(parsedUsage['field']);
					return;

				case 'GlobalVar':
					usages.GlobalVariable.add(parsedUsage['field']);
					return;
			}

			const activityRegExp = new RegExp(/^A[_0-9]+$/, 'ig');
			if (activityRegExp.exec(parsedUsage['object']))
			{
				usages.Activity.add([parsedUsage['object'], parsedUsage['field']]);
			}
		}
	}

	hasBrokenLink()
	{
		const usages = BX.clone(this.collectUsages());

		if (!this.template)
		{
			return false;
		}

		const objectsData = {
			Document: this.#document.getFields(),
			Constant: this.#template.getConstants(),
			Variable: this.#template.getVariables(),
			GlobalConstant: this.#template.globalConstants,
			GlobalVariable: this.#template.globalVariables,
			Parameter: this.#template.getParameters(),
			Activity: this.#template.getSerializedRobots()
		};

		for (const object in usages)
		{
			if (usages[object].size > 0)
			{
				const source = new Set();

				for (const key in objectsData[object])
				{
					if (objectsData[object][key]['Id'])
					{
						source.add(objectsData[object][key]['Id']);
					}
					else if (objectsData[object][key]['Name'])
					{
						source.add(objectsData[object][key]['Name']);
					}
				}

				for (const value of usages[object].values())
				{
					let searchInSource = value;
					let id = value;

					if (Type.isArray(searchInSource))
					{
						searchInSource = value[0];
						id = value[1];
					}

					if (!source.has(searchInSource))
					{
						return true;
					}

					if (object === 'Activity')
					{
						const robot = this.#template.getRobotById(searchInSource);
						if (!robot.getReturnProperty(id))
						{
							return true;
						}
					}
				}
			}
		}

		return false;
	}
}