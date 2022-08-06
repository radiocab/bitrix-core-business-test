import {Core} from 'im.v2.application.core';
import {LeftPanel as LeftPanelComponent} from 'im.v2.component.left-panel';
import {RecentPullHandler} from 'im.v2.provider.pull';
import {PullHandlers} from 'im.v2.const';

type LeftPanelApplicationParams = {
	node?: string | HTMLElement,
	preloadedList?: Object
}

export class LeftPanelApplication
{
	params: LeftPanelApplicationParams;
	inited: boolean = false;
	initPromise: Promise = null;
	initPromiseResolver: Function = null;
	rootNode: string | HTMLElement = null;
	vueInstance: Object = null;
	controller: Object = null;
	bitrixVue: Object = null;

	#applicationName = 'LeftPanel';

	constructor(params: LeftPanelApplicationParams = {})
	{
		this.initPromise = new Promise((resolve) => {
			this.initPromiseResolver = resolve;
		});

		this.params = params;

		this.rootNode = this.params.node || document.createElement('div');

		this.initCore()
			.then(() => this.initPullHandler())
			.then(() => this.initComplete())
		;
	}

	initPullHandler()
	{
		if (this.controller.pullHandlers.includes(PullHandlers.recent))
		{
			return Promise.resolve();
		}
		this.controller.pullClient.subscribe(
			new RecentPullHandler({
				store: this.controller.getStore(),
				controller: this.controller,
				application: this
			})
		);
		this.controller.pullHandlers.push(PullHandlers.recent);

		return Promise.resolve();
	}

	initCore()
	{
		return new Promise((resolve) => {
			Core.ready().then(controller => {
				this.controller = controller;
				resolve();
			});
		});
	}

	initComponent(node)
	{
		if (this.vueInstance)
		{
			this.bitrixVue.unmount();
			this.vueInstance = null;
		}

		return this.controller.createVue(this, {
			name: this.#applicationName,
			el: node,
			components: {LeftPanelComponent},
			template: `<LeftPanelComponent />`,
		})
		.then(vue => {
			this.vueInstance = vue;

			return Promise.resolve();
		});
	}

	initComplete()
	{
		this.inited = true;
		this.initPromiseResolver(this);
	}

	ready()
	{
		if (this.inited)
		{
			return Promise.resolve(this);
		}

		return this.initPromise;
	}
}