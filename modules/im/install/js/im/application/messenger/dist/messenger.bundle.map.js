{"version":3,"sources":["messenger.bundle.js"],"names":["this","BX","Messenger","exports","im_application_core","im_provider_rest","promise","ui_vue","im_lib_logger","im_lib_utils","im_component_recent","im_component_dialog","im_component_textarea","pull_component_status","im_const","im_mixin","main_core_events","main_core","BitrixVue","component","props","userId","default","initialDialogId","mixins","DialogCore","DialogReadMessages","DialogQuoteMessage","DialogClickOnCommand","DialogClickOnMention","DialogClickOnUserName","DialogClickOnMessageMenu","DialogClickOnMessageRetry","DialogClickOnUploadCancel","DialogClickOnReadList","DialogSetMessageReaction","DialogOpenMessageReactionList","DialogClickOnKeyboardButton","DialogClickOnChatTeaser","DialogClickOnDialog","TextareaCore","TextareaUploadFile","data","dialogId","notify","textareaDrag","textareaHeight","textareaMinimumHeight","textareaMaximumHeight","Utils","device","isMobile","created","EventEmitter","subscribe","onOpenMessenger","beforeDestroy","unsubscribe","onTextareaDragEventRemove","computed","DeviceType","textareaHeightStyle","state","flex","isDialog","dialog","isChatId","isEnableGesture","isEnableGestureQuoteFromRight","localizeEmptyChat","Loc","getMessage","methods","_ref","event","id","onTextareaStartDrag","Logger","log","changedTouches","textareaDragCursorStartPoint","clientY","textareaDragHeightStartPoint","onTextareaDragEventAdd","emit","EventType","textarea","setBlur","onTextareaContinueDrag","textareaDragCursorControlPoint","Math","max","min","onTextareaStopDrag","$store","commit","scrollToBottom","chatId","force","document","addEventListener","removeEventListener","logEvent","name","_len","arguments","length","params","Array","_key","info","apply","concat","template","MessengerApplication","_this","undefined","babelHelpers","classCallCheck","inited","initPromise","Promise","rootNode","node","createElement","VueVendorV2","initCore","then","initComponent","initComplete","createClass","key","value","_this2","resolve","reject","Core","ready","controller","_this3","console","getStore","getDialogId","options","quoteEnable","autoplayVideo","darkBackground","addRestAnswerHandler","DialogRestHandler","create","store","context","getters","application","diskFolderId","createVue","el","getUserId","vue","promise$$1","getLocalize","parseInt","toString","getHost","location","origin","getSiteId","addLocalize","phrases","Application","Provider","Rest","Lib","Im","Component","window","Const","Mixin","Event"],"mappings":"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","file":"messenger.bundle.map.js"}