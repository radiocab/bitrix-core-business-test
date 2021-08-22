{"version":3,"sources":["calendar-section.js"],"names":["window","SectionController","calendar","data","config","sections","this","sectionIndex","hiddenSections","prepareData","showTasks","taskSection","TaskSection","sectionCustomization","util","ownerId","push","id","length","BX","addCustomEvent","proxy","unsetSectionHandler","sortSections","prototype","params","i","section","Section","sort","a","b","type","isFunction","isPseudo","name","localeCompare","getCurrentSection","lastUsed","getUserOption","getSection","canDo","isActive","belongsToView","isExternalMode","getSectionList","result","parseInt","getSuperposedSectionList","isSuperposed","getSectionListForEdit","getSectionGroupList","sectionGroups","title","message","getSuperposedTrackedUsers","forEach","user","htmlspecialchars","FORMATTED_NAME","ID","getDefaultSectionName","getDefaultSectionColor","sectionList","usedColors","color","defaultColors","getDefaultColors","randomInt","getDefaultSectionAccess","new_section_access","saveSection","access","promise","Promise","trim","onCustomEvent","isCustomization","ajax","runAction","analyticsLabel","action","userId","customization","then","delegate","response","toLowerCase","reload","updateData","NAME","COLOR","fulfill","displayError","errors","sectionIsShown","in_array","getHiddenSections","setHiddenSections","getSectionsInfo","allActive","superposed","active","hidden","isShown","sectionId","undefined","deleteFromArray","CAL_TYPE","OWNER_ID","Object","defineProperties","value","writable","enumerable","sectionController","show","array_search","calendarContext","userIsOwner","userOptions","save","hide","remove","confirm","Calendar","SectionManager","setNewEntrySectionId","bind","hideGoogle","getLink","LINK","canBeConnectedToOutlook","OUTLOOK_JS","CAL_DAV_CAL","CAL_DAV_CON","browser","IsMac","connectToOutlook","jsOutlookUtils","loadScript","eval","e","isVirtual","PERM","SUPERPOSED","indexOf","GAPI_CALENDAR_ID","EXTERNAL_TYPE","isGoogle","isCalDav","isCompanyCalendar","belongsToOwner","belongsToUser","ACTIVE","defaultColor","defaultName","isUserCalendar","isGroupCalendar","edit_section","view_full","view_time","view_title","apply","create","constructor","BXEventCalendar"],"mappings":"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","file":"calendar-section.map.js"}