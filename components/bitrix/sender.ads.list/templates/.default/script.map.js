{"version":3,"sources":["script.js"],"names":["BX","namespace","Sender","LetterList","Page","prototype","init","params","this","gridId","actionUri","pathToEdit","mess","buttonAdd","menuItems","messages","map","message","id","CODE","text","NAME","onclick","onMenuItemClick","bind","className","IS_AVAILABLE","initMenuAdd","ajaxAction","AjaxAction","userErrorHandler","ErrorHandler","addCustomEvent","onGridUpdated","remove","letterId","sendChangeStateAction","copy","self","data","copiedId","open","replace","reloadGrid","send","pause","stop","resume","actionName","callback","messageCode","Main","gridManager","grid","getById","instance","getRows","getDataset","changeGridLoaderShowing","request","action","onsuccess","apply","onusererror","getHandlers","editUrl","onfailure","urlParams","B24License","showPopup","popupMenu","close","URL","items","show","PopupMenu","create","autoHide","autoClose","UI","Hint","getTable","window"],"mappings":"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","file":"script.map.js"}