{"version":3,"file":"logger.bundle.map.js","names":["this","BX","Messenger","v2","exports","main_core","_types","babelHelpers","classPrivateFieldLooseKey","_config","_custom","_localStorageKey","_save","_load","_getStyles","_getRemoveString","Logger","constructor","Object","defineProperty","value","_load2","_save2","writable","classPrivateFieldLooseBase","desktop","log","info","warn","error","trace","setConfig","types","entries","forEach","type","Type","isUndefined","enable","disable","isEnabled","params","console","window","localStorage","custom","JSON","stringify","setItem","getItem","isString","parse","_getStyles2","styles","_getRemoveString2","result","style","push","logger","Lib"],"sources":["logger.bundle.js"],"mappings":"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"}