this.BX = this.BX || {};
this.BX.Messenger = this.BX.Messenger || {};
this.BX.Messenger.v2 = this.BX.Messenger.v2 || {};
(function (exports,marketplace,ui_vue3_vuex,main_core,im_v2_application_core,im_v2_const) {
	'use strict';

	var _loadLink = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("loadLink");
	var _getPlacementOptions = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("getPlacementOptions");
	class MarketService {
	  constructor() {
	    Object.defineProperty(this, _getPlacementOptions, {
	      value: _getPlacementOptions2
	    });
	    Object.defineProperty(this, _loadLink, {
	      writable: true,
	      value: ''
	    });
	  }
	  openPlacement(item, context) {
	    return new Promise((resolve, reject) => {
	      const formData = new FormData();
	      Object.entries(item.loadConfiguration).forEach(([key, value]) => {
	        formData.append(`PARAMS[params][${key}]`, value);
	      });
	      Object.entries(babelHelpers.classPrivateFieldLooseBase(this, _getPlacementOptions)[_getPlacementOptions](context)).forEach(([key, value]) => {
	        formData.append(`PARAMS[params][PLACEMENT_OPTIONS][${key}]`, value);
	      });
	      const requestPrams = {
	        method: 'POST',
	        body: formData
	      };
	      fetch(babelHelpers.classPrivateFieldLooseBase(this, _loadLink)[_loadLink], requestPrams).then(response => response.text()).then(textResponse => resolve(textResponse)).catch(error => reject(error));
	    });
	  }
	  setLoadLink(link) {
	    babelHelpers.classPrivateFieldLooseBase(this, _loadLink)[_loadLink] = link;
	  }
	}
	function _getPlacementOptions2(context) {
	  const placementOptions = {};
	  if (context.dialogId) {
	    placementOptions.dialogId = context.dialogId;
	  }
	  if (context.messageId) {
	    placementOptions.messageId = context.messageId;
	  }
	  return placementOptions;
	}

	const MarketTypes = Object.freeze({
	  user: 'user',
	  chat: 'chat',
	  lines: 'lines',
	  crm: 'crm',
	  all: 'all'
	});
	var _canShowPlacementInChat = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("canShowPlacementInChat");
	var _matchDialogType = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("matchDialogType");
	var _isUser = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("isUser");
	var _isChat = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("isChat");
	var _isLines = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("isLines");
	var _isCrm = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("isCrm");
	class AvailabilityManager {
	  constructor() {
	    Object.defineProperty(this, _isCrm, {
	      value: _isCrm2
	    });
	    Object.defineProperty(this, _isLines, {
	      value: _isLines2
	    });
	    Object.defineProperty(this, _isChat, {
	      value: _isChat2
	    });
	    Object.defineProperty(this, _isUser, {
	      value: _isUser2
	    });
	    Object.defineProperty(this, _matchDialogType, {
	      value: _matchDialogType2
	    });
	    Object.defineProperty(this, _canShowPlacementInChat, {
	      value: _canShowPlacementInChat2
	    });
	  }
	  getAvailablePlacements(placements, dialogType = '') {
	    return placements.filter(placement => babelHelpers.classPrivateFieldLooseBase(this, _canShowPlacementInChat)[_canShowPlacementInChat](placement, dialogType));
	  }
	}
	function _canShowPlacementInChat2(placement, dialogType) {
	  if (!placement.options.context || !dialogType) {
	    return true;
	  }
	  return placement.options.context.some(marketType => babelHelpers.classPrivateFieldLooseBase(this, _matchDialogType)[_matchDialogType](marketType, dialogType));
	}
	function _matchDialogType2(marketType, dialogType) {
	  switch (marketType) {
	    case MarketTypes.user:
	      return babelHelpers.classPrivateFieldLooseBase(this, _isUser)[_isUser](dialogType);
	    case MarketTypes.chat:
	      return babelHelpers.classPrivateFieldLooseBase(this, _isChat)[_isChat](dialogType);
	    case MarketTypes.lines:
	      return babelHelpers.classPrivateFieldLooseBase(this, _isLines)[_isLines](dialogType);
	    case MarketTypes.crm:
	      return babelHelpers.classPrivateFieldLooseBase(this, _isCrm)[_isCrm](dialogType);
	    case MarketTypes.all:
	      return true;
	    default:
	      return false;
	  }
	}
	function _isUser2(dialogType) {
	  return dialogType === im_v2_const.DialogType.user;
	}
	function _isChat2(dialogType) {
	  return dialogType !== im_v2_const.DialogType.lines && dialogType !== im_v2_const.DialogType.crm && dialogType !== im_v2_const.DialogType.user;
	}
	function _isLines2(dialogType) {
	  return dialogType === im_v2_const.DialogType.lines;
	}
	function _isCrm2(dialogType) {
	  return dialogType === im_v2_const.DialogType.crm;
	}

	var _store = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("store");
	var _marketService = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("marketService");
	var _availabilityManager = /*#__PURE__*/babelHelpers.classPrivateFieldLooseKey("availabilityManager");
	class MarketManager {
	  static getInstance() {
	    if (!this.instance) {
	      this.instance = new this();
	    }
	    return this.instance;
	  }
	  static init(marketApps) {
	    MarketManager.getInstance().init(marketApps);
	  }
	  constructor() {
	    Object.defineProperty(this, _store, {
	      writable: true,
	      value: void 0
	    });
	    Object.defineProperty(this, _marketService, {
	      writable: true,
	      value: void 0
	    });
	    Object.defineProperty(this, _availabilityManager, {
	      writable: true,
	      value: void 0
	    });
	    babelHelpers.classPrivateFieldLooseBase(this, _store)[_store] = im_v2_application_core.Core.getStore();
	    babelHelpers.classPrivateFieldLooseBase(this, _marketService)[_marketService] = new MarketService();
	    babelHelpers.classPrivateFieldLooseBase(this, _availabilityManager)[_availabilityManager] = new AvailabilityManager();
	  }
	  init(marketApps) {
	    babelHelpers.classPrivateFieldLooseBase(this, _store)[_store].dispatch('market/set', marketApps);
	    babelHelpers.classPrivateFieldLooseBase(this, _marketService)[_marketService].setLoadLink(marketApps.links.load);
	  }
	  getAvailablePlacementsByType(placementType, dialogId = '') {
	    const placements = babelHelpers.classPrivateFieldLooseBase(this, _store)[_store].getters['market/getByPlacement'](placementType);
	    const dialogType = dialogId ? babelHelpers.classPrivateFieldLooseBase(this, _store)[_store].getters['dialogues/get'](dialogId).type : '';
	    return babelHelpers.classPrivateFieldLooseBase(this, _availabilityManager)[_availabilityManager].getAvailablePlacements(placements, dialogType);
	  }
	  loadPlacement(id, context = {}) {
	    const placement = babelHelpers.classPrivateFieldLooseBase(this, _store)[_store].getters['market/getById'](Number.parseInt(id, 10));
	    return babelHelpers.classPrivateFieldLooseBase(this, _marketService)[_marketService].openPlacement(placement, context);
	  }
	  unloadPlacement(placementId) {
	    const appLayoutNew = Object.values(BX.rest.layoutList).filter(layout => {
	      return layout.params.placementId === placementId;
	    });
	    if (appLayoutNew.length > 0) {
	      appLayoutNew.forEach(layout => {
	        layout.destroy();
	      });
	    }
	  }
	  static openSlider(placement, context) {
	    main_core.Runtime.loadExtension('applayout').then(() => {
	      BX.rest.AppLayout.openApplication(placement.loadConfiguration.ID, context, placement.loadConfiguration);
	    });
	  }
	  static openMarketplace() {
	    const marketplaceImPlacementCode = 'IM_CHAT';
	    BX.SidePanel.Instance.open(`/market/?placement=${marketplaceImPlacementCode}`);
	  }
	}

	exports.MarketManager = MarketManager;

}((this.BX.Messenger.v2.Lib = this.BX.Messenger.v2.Lib || {}),BX,BX.Vue3.Vuex,BX,BX.Messenger.v2.Application,BX.Messenger.v2.Const));
//# sourceMappingURL=market.bundle.js.map
