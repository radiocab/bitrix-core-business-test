{"version":3,"file":"body.bundle.map.js","names":["exports","ui_designTokens","im_view_element_media","im_view_element_attach","im_view_element_keyboard","im_view_element_chatteaser","ui_vue_components_reaction","ui_vue","ui_vue_vuex","im_model","im_const","im_lib_utils","main_core","main_core_events","_createForOfIteratorHelper","o","allowArrayLike","it","Symbol","iterator","Array","isArray","_unsupportedIterableToArray","length","i","F","s","n","done","value","e","_e","f","TypeError","normalCompletion","didErr","err","call","step","next","_e2","minLen","_arrayLikeToArray","Object","prototype","toString","slice","constructor","name","from","test","arr","len","arr2","ownKeys","object","enumerableOnly","keys","getOwnPropertySymbols","symbols","filter","sym","getOwnPropertyDescriptor","enumerable","push","apply","_objectSpread","target","arguments","source","forEach","key","babelHelpers","defineProperty","getOwnPropertyDescriptors","defineProperties","BX","window","_ContentType","freeze","default","progress","image","audio","video","richLink","BitrixVue","component","props","userId","dialogId","chatId","messageType","MessageType","self","message","type","MessagesModel","create","getElementState","enableReactions","showName","showAvatar","referenceContentBodyClassName","referenceContentNameClassName","created","this","dateFormatFunction","cacheFormatDate","methods","clickByUserName","event","Utils","platform","isMobile","EventEmitter","emit","EventType","dialog","clickOnUserName","clickByChatTeaser","clickOnChatTeaser","clickByKeyboardButton","clickOnKeyboardButton","setReaction","setMessageReaction","openReactionList","openMessageReactionList","formatDate","date","id","toJSON","dateFormat","getFormatType","Messenger","Const","DateFormat","$Bitrix","Loc","getMessages","_getDateFormat","format","_this","Main","Date","_getMessage","phrase","getMessage","isDesktop","isBitrixDesktop","getDesktopVersion","isBitrixMobile","computed","ContentType","contentType","filesData","onlyImage","onlyVideo","onlyAudio","inProgress","_iterator","_step","file","formattedDate","messageText","_this2","isDeleted","textConverted","messageParams","params","replacement","replace","whole","text","userName","user","$store","getters","htmlspecialchars","index","LINK_ACTIVE","includes","messageAttach","ATTACH","messageReactions","REACTION","isEdited","IS_EDITED","IS_DELETED","chatColor","DialogType","color","authorId","_this3","files","FILE_ID","fileId","commit","data","keyboardButtons","result","KEYBOARD","chatTeaser","CHAT_ID","CHAT_LAST_DATE","CHAT_MESSAGE","messageCounter","messageLastDate","languageId","application","common","NAME","Text","decode","firstName","userColor","extranet","Vuex","mapState","state","template","Model","Lib","Event"],"sources":["body.bundle.js"],"mappings":"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"}