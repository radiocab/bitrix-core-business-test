{"version":3,"sources":["script.js"],"names":["exports","main_core","_templateObject","data","babelHelpers","taggedTemplateLiteral","PropertyCreationForm","_BX$Catalog$IblockFie","inherits","classCallCheck","this","possibleConstructorReturn","getPrototypeOf","apply","arguments","createClass","key","value","initialize","id","settings","length","undefined","get","prototype","call","BX","addCustomEvent","delegate","onFormSave","onFormCancel","componentName","signedParameters","getInputTitle","isCreationMode","_field","getTitle","sender","params","_isLocked","addClass","_saveButton","fields","formatConfiguratorFields","addProperty","updateProperty","_this","ajax","runComponentAction","mode","then","response","CODE","PROPERTY_GRID_CODE","SidePanel","Instance","postMessage","window","catch","onError","bind","_this2","_this3","Dom","removeClass","_errorContainer","clean","Type","isArray","errors","forEach","error","showError","getFormFieldName","name","append","Tag","render","message","_this4","form","FormData","formatted","NAME","label","MULTIPLE","multiple","IS_REQUIRED","mandatory","IS_PUBLIC","isPublic","PROPERTY_TYPE","field","ID","getId","typeId","DIRECTORY_NAME","directoryName","USER_TYPE","enumeration","enumItem","SORT","VALUE","XML_ID","FILE_ID","file","VALUES","LIST_TYPE","_i","_Object$entries","Object","entries","_Object$entries$_i","slicedToArray","item","close","Catalog","IblockFieldConfigurator","Reflection","namespace"],"mappings":"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","file":"script.map.js"}