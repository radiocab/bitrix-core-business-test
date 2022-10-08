// @flow
'use strict';

import 'ui.tilegrid';
import 'ui.forms';
import { Dom, Event, Loc, Tag, Type, Text } from 'main.core';

export default class SyncPanelUnit
{
	logoClassName = '';

	constructor(options)
	{
		this.options = options;
		this.connectionProvider = this.options.connectionProvider;
	}

	getConnectionTemplate()
	{
		if (!this.connectionTemplate)
		{
			this.connectionTemplate = this.connectionProvider.getClassTemplateItem().createInstance(this.connectionProvider);
		}
		
		return this.connectionTemplate;
	}

	renderTo(outerWrapper)
	{
		if (Type.isElementNode(outerWrapper))
		{
			outerWrapper.appendChild(this.getContent());
		}
	}

	getContent()
	{
		this.unitNode = Tag.render`
			<div class="calendar-sync__calendar-item">
				<div class="calendar-sync__calendar-item--logo">
					${this.getLogoNode()}
				</div>
				<div class="calendar-sync__calendar-item--container">
					<div class="calendar-sync__calendar-item--title">
						${this.getTitle()}
						${this.getSyncInfoWrap()}
					</div>
					${this.getButtonsWrap()}
				</div>
			</div>
		`;

		return this.unitNode;
	}

	getLogoNode()
	{
		return Tag.render`<div class="calendar-sync__calendar-item--logo-image ${this.connectionProvider.getSyncPanelLogo()}"></div>`;
	}

	getTitle()
	{
		return this.connectionProvider.getSyncPanelTitle();
	}

	getSyncInfoWrap()
	{
		this.syncInfoWrap = Tag.render`
			<div class="calendar-sync__account-info">
				<div class="calendar-sync__account-info--icon --animate"></div>
				<span data-role="sync_info_text" />
			</div>
		`;
		return this.syncInfoWrap;
	}

	setSyncStatus(mode)
	{
		this.unitNode.className = 'calendar-sync__calendar-item';
		switch (mode)
		{
			case this.connectionProvider.STATUS_SUCCESS:
				Dom.addClass(this.unitNode, '--complete');
				this.setSyncInfoStatusText(this.formatSyncTime(this.connectionProvider.getSyncDate()));
				break;
			case this.connectionProvider.STATUS_FAILED:
				Dom.addClass(this.unitNode, '--error');
				this.setSyncInfoStatusText(Loc.getMessage('CAL_SYNC_INFO_STATUS_ERROR'));
				break;
			case this.connectionProvider.STATUS_PENDING:
				Dom.addClass(this.unitNode, '--pending');
				this.setSyncInfoStatusText('');
				break;
			case this.connectionProvider.STATUS_SYNCHRONIZING:
				Dom.addClass(this.unitNode, '--active');
				this.setSyncInfoStatusText(Loc.getMessage('CAL_SYNC_INFO_STATUS_SYNCHRONIZING'));
				break;
			case this.connectionProvider.STATUS_NOT_CONNECTED:
				this.setSyncInfoStatusText('');
				break;
		}
	}

	setSyncInfoStatusText(text)
	{
		const syncInfoStatusText = this.syncInfoWrap.querySelector('[data-role="sync_info_text"]');
		if (Type.isElementNode(syncInfoStatusText))
		{
			syncInfoStatusText.innerHTML = Text.encode(text).toUpperCase();
		}
	}

	getButtonsWrap()
	{
		if (!Type.isElementNode(this.buttonsWrap))
		{
			this.buttonsWrap = Tag.render`<div class="calendar-sync__calendar-item--buttons">
				${this.getMoreButton()}
				${this.getButton()}
			</div>`;

			Event.bind(this.moreButton, 'click', this.handleItemClick.bind(this));
		}

		return this.buttonsWrap;
	}

	refreshButton()
	{
		Dom.clean(this.buttonsWrap);
		this.moreButton = this.buttonsWrap.appendChild(this.getMoreButton());
		this.button = this.buttonsWrap.appendChild(this.getButton());
	}

	getButton()
	{
		switch (this.connectionProvider.getStatus())
		{
			case this.connectionProvider.STATUS_SUCCESS:
				this.button = Tag.render`
					<a data-role="status-success" class="ui-btn ui-btn-icon-success ui-btn-link">
						${Loc.getMessage('CAL_BUTTON_STATUS_SUCCESS')}
					</a>`;
				break;
			case this.connectionProvider.STATUS_FAILED:
				this.button = Tag.render`
					<a data-role="status-failed" class="ui-btn ui-btn-icon-fail ui-btn-link">
						${Loc.getMessage('CAL_BUTTON_STATUS_FAILED')}
					</a>`;
				break;
			case this.connectionProvider.STATUS_PENDING:
				this.button = Tag.render`
					<a data-role="status-pending" class="ui-btn ui-btn-disabled ui-btn-link">
						${Loc.getMessage('CAL_BUTTON_STATUS_PENDING')}
					</a>`;
				break;
			case this.connectionProvider.STATUS_NOT_CONNECTED:
				this.button = Tag.render`
					<a data-role="status-not_connected" class="ui-btn ui-btn-success ui-btn-round">
						${Loc.getMessage('CAL_BUTTON_STATUS_NOT_CONNECTED')}
					</a>`;
				Event.bind(this.button, 'click', this.handleItemClick.bind(this));
				break;
			case this.connectionProvider.STATUS_SYNCHRONIZING:
				this.button = Tag.render`
					<a data-role="status-not_connected" class="ui-btn ui-btn-success ui-btn-round ui-btn-clock ui-btn-disabled">
						${Loc.getMessage('CAL_BUTTON_STATUS_SUCCESS')}
					</a>`;
				break;
		}
		return this.button;
	}

	getMoreButton()
	{
		this.moreButton = Tag.render`
			<div 
				data-role="more-button" 
				class="ui-btn ui-btn-round ui-btn-light-border calendar-sync__calendar-item--more"
			></div>`;
		return this.moreButton;
	}

	handleItemClick(e)
	{
		const status = this.connectionProvider.getStatus();

		if ([this.connectionProvider.STATUS_SUCCESS, this.connectionProvider.STATUS_FAILED].includes(status))
		{
			if (this.connectionProvider.hasMenu())
			{
				this.connectionProvider.showMenu(this.button);
			}
			else if (this.connectionProvider.getConnectStatus())
			{
				this.connectionProvider.openActiveConnectionSlider(this.connectionProvider.getConnection());
			}
			else
			{
				this.connectionProvider.openInfoConnectionSlider();
			}
		}
		else if(status === this.connectionProvider.STATUS_NOT_CONNECTED)
		{
			this.getConnectionTemplate().handleConnectButton();
		}
	}

	formatSyncTime(timestamp)
	{
		if (Type.isDate(timestamp))
		{
			timestamp = timestamp.getTime() / 1000;
		}

		return BX.date.format(
			[
				["tommorow", "tommorow, H:i:s"],
				["s" , Loc.getMessage('CAL_JUST')],
				["i" , "iago"],
				["H", "Hago"],
				["d", "dago"],
				["m100", "mago"],
				["m", "mago"],
				["-", ""]
			],
			timestamp
		);
	}
}
