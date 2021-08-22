{"version":3,"sources":["script.js"],"names":["exports","main_core","main_core_events","main_popup","ui_dialogs_messagebox","im_lib_clipboard","namespace","Reflection","ConferenceList","params","babelHelpers","classCallCheck","this","pathToAdd","pathToEdit","pathToList","sliderWidth","gridId","gridManager","getClass","init","createClass","key","value","bindEvents","_this","EventEmitter","subscribe","bindGridEvents","bindCreateButtonEvents","_this2","emptyListCreateButton","document","querySelector","Event","bind","openCreateSlider","panelCreateButton","_this3","rows","querySelectorAll","forEach","row","conferenceId","getAttribute","chatId","publicLink","conferenceIsFinished","moreButton","event","preventDefault","openContextMenu","buttonNode","copyButton","copyLink","chatNameLink","openEditSlider","openSlider","replace","path","closeContextMenu","BX","SidePanel","Instance","open","width","cacheable","link","Clipboard","copy","UI","Notification","Center","notify","content","Loc","getMessage","_ref","_this4","ajax","runComponentAction","mode","data","then","_ref2","_ref2$data","canDelete","delete","canEdit","edit","Type","isDomNode","menuItems","text","onclick","openChat","push","className","deleteAction","menu","Menu","bindElement","items","events","onPopupClose","destroy","show","catch","response","console","error","close","BXIM","openMessenger","_this5","onSuccessfulDelete","onFailedDelete","top","window","location","reload","MessageBox","alert","message","Main","Dialogs","Messenger","Lib"],"mappings":"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","file":"script.map.js"}