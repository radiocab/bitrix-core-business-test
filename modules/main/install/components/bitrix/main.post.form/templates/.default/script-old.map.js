{"version":3,"sources":["script-old.js"],"names":["window","repo","selector","BXPostFormTags","formID","buttonID","this","popup","sharpButton","addNewLink","tagsArea","hiddenField","popupContent","BX","ready","proxy","init","prototype","tagsContainer","popupInput","findChild","tag","tags","findChildren","className","i","cnt","length","bind","onTagDelete","obj","tagBox","parentNode","tagValue","getAttribute","onButtonClick","onAddNewClick","remove","value","replace","show","PopupWindow","content","lightShadow","offsetTop","offsetLeft","autoHide","angle","closeByEsc","zIndex","buttons","PopupWindowButton","text","message","events","click","onTagAdd","onKeyPress","focus","addTag","tagStr","type","isNotEmptyString","split","result","util","trim","allTags","in_array","newTagDelete","newTag","create","children","attrs","class","insertBefore","document","createTextNode","push","close","event","PreventDefault","key","keyCode","which","setTimeout","BXPostFormImportant","inputName","fireButton","activeBlock","form","showActive","hideActive","hide","lastWaitElement","MPFbuttonShowWait","el","isElementNode","tagName","addClass","defer","disabled","MPFMention","listen","plus","bSearch","node","mode","addCustomEvent","someObject","eventNode","onCustomEvent","params","selectorId","id","bindNode","isDomNode","bindPosition","isNotEmptyObject","dialog","UI","EntitySelector","Dialog","getById","deselectAll","search","setBindElement","adjustPosition","onKeyDownHandler","e","editor","MPFgetSelectorId","KEY_CODES","mentText","GetTextContent","shiftKey","modifiers","altKey","ctrlKey","getModifierState","range","selection","GetRange","doc","GetIframeDoc","txt","endContainer","textContent","determiner","slice","endOffset","prevS","listenFlag","leaveContent","setStart","setEnd","SetSelection","props","Surround","getMentionNodePosition","activeDialogTab","getActiveTab","getId","enter","up","down","left","right","KeyboardEvent","bubbles","cancelable","view","dispatchEvent","iframeKeyDownPreventDefault","stopPropagation","preventDefault","collapsed","findParent","n","body","SetAfter","onKeyUpHandler","escape","mentTextOrig","_lastText","lastText","matchSep","match","innerHTML","sepNode","html","INVISIBLE_SPACE","InsertAfter","onTextareaKeyDownHandler","textareaKeyDownPreventDefault","onTextareaKeyUpHandler","cursor","textareaView","GetValue","GetCursorPosition","indexOf","valueBefore","substr","charPos","Math","max","lastIndexOf","_this","shiftPressed","shiftTimeout","clearTimeout","element","selectionStart","lastChar","textarea","pos","getElementById","mention","mentPos","editorPos","dom","areaCont","editorDocScroll","GetWindowScrollPos","top","bottom","scrollTop","scrollLeft","BxInsertMention","item","editorId","bNeedComa","LHEPostForm","getEditor","spaceNode","entityId","GetViewMode","htmlspecialcharsback","name","bxTagData","projectId","projectName","departmentId","departmentName","userId","userName","SetBxTag","ReplaceNode","InsertNode","parentMention","bbCode","Focus","SetValue","setSelectionRange","WrapWith","fireAddEvent","handler","getHandler","formEntityType","editorParams","tasksLimitExceeded","Main","PostFormTasksLimit","showPopup","formId","formNode","MPFMentionInit","initDestination","data","DEST_DATA","destData","JSON","parse","Array","isArray","selectorInstance","preselectedItems","setPreselectedItems","entityType","isExtranet","isEmail","addItem","avatar","customData","email","title","select","callbackParams","toLowerCase","ucFormManager","reg","RegExp","test","getHandlerByFormId","exec","targetNode","context","multiple","preload","enableSearch","clearSearchOnSelect","hideOnSelect","hideByEsc","entities","height","width","compactView","onShow","BXfpdOnDialogOpen","onHide","BXfpdOnDialogClose","Item:onSelect","selectedItem","getData","getTitle","getEntityId","ment","InsertHtml","firstChild","nodeType","nodeValue","MPFEntitySelector","inputNode","messages","isPlainObject","tagNodeId","inputNodeId","TagSelector","dialogOptions","recalcValue","getDialog","getSelectedItems","Item:onDeselect","options","all-users","allUsersTitle","allowView","isBoolean","allowToAll","emailUsers","allowSearchEmailUsers","inviteGuestLink","myEmailUsers","features","blog","selectMode","allowFlatDepartments","addButtonCaption","addButtonCaptionMore","renderTo","selectedItems","forEach","stringify"],"mappings":"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","file":"script-old.map.js"}