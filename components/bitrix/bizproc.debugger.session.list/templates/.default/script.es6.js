import { Reflection, ajax, Type, Event, Uri } from 'main.core';
import { Alert, AlertColor } from 'ui.alerts';
import { Manager } from 'bizproc.debugger';

const namespace = Reflection.namespace('BX.Bizproc.Component');

class DebuggerSessionList
{
	gridId;
	createDebuggerSessionButton;
	errorsContainerDiv;
	documentSigned;
	signedParameters;

	constructor(options)
	{
		if (Type.isPlainObject(options))
		{
			this.gridId = options.gridId;
			this.createDebuggerSessionButton = options.createDebuggerSessionButton;
			this.errorsContainerDiv = options.errorsContainerDiv;
			this.documentSigned = options.documentSigned;
			this.signedParameters = options.signedParameters;
		}
	}

	init()
	{
		if (this.createDebuggerSessionButton)
		{
			Event.bind(this.createDebuggerSessionButton, 'click', event => this.createSession());
		}
	}

	createSession()
	{
		Manager.Instance.openDebuggerStartPage(this.documentSigned).then();
	}

	showSession(sessionId: string)
	{
		Manager.Instance.openSessionLog(sessionId).then();
	}

	deleteChosenSessions()
	{
		const grid = this.getGrid();
		if (grid)
		{
			this.deleteSessions(grid.getRows().getSelectedIds());
		}
	}

	deleteSessions(sessionIds: Array<string>)
	{
		ajax.runComponentAction('bitrix:bizproc.debugger.session.list', 'deleteSessions', {
			mode: 'class',
			signedParameters: this.signedParameters,
			data: {sessionIds},
		}).then((response) => {
			this.reloadGrid();
		}).catch((response) => {
			this.showErrors(response.errors);
		});
	}

	showErrors(errors: Array<{message: string}>)
	{
		this.errorsContainerDiv.style.margin = '10px';

		errors.forEach((error) => {
			const alert = new Alert({
				text: error.message,
				color: AlertColor.DANGER,
				closeBtn: true,
				animated: true,
			});

			alert.renderTo(this.errorsContainerDiv);
		});
	}

	reloadGrid()
	{
		const grid = this.getGrid();
		if (grid)
		{
			grid.reload();
		}
	}

	getGrid()
	{
		if (this.gridId)
		{
			return BX.Main.gridManager && BX.Main.gridManager.getInstanceById(this.gridId);
		}
		return null;
	}
}

namespace.DebuggerSessionList = DebuggerSessionList;