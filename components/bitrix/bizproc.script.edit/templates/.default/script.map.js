{"version":3,"sources":["script.js"],"names":["exports","main_core","main_core_events","ui_notification","_templateObject","_templateObject2","_templateObject3","_templateObject4","_templateObject5","_templateObject6","_templateObject7","_createForOfIteratorHelper","o","allowArrayLike","it","Symbol","iterator","Array","isArray","_unsupportedIterableToArray","length","i","F","s","n","done","value","e","_e","f","TypeError","normalCompletion","didErr","err","call","step","next","_e2","minLen","_arrayLikeToArray","Object","prototype","toString","slice","constructor","name","from","test","arr","len","arr2","_classPrivateMethodInitSpec","obj","privateSet","_checkPrivateRedeclaration","add","privateCollection","has","_classPrivateMethodGet","receiver","fn","namespace","Reflection","toJsonString","data","JSON","stringify","v","_getRobotsTemplate","WeakSet","_activateSection","_validateScriptName","_validateConstants","ScriptEditComponent","options","babelHelpers","classCallCheck","this","defineProperty","Type","isPlainObject","baseNode","leftMenuNode","saveButtonNode","formNode","documentType","signedParameters","saveCallback","automationDesigner","BX","Bizproc","Automation","Designer","getInstance","component","createClass","key","init","_this","Event","bind","saveHandler","initMenu","scriptNameNode","elements","NAME","isStringFilled","Dom","addClass","closest","removeClass","EventEmitter","subscribe","configsMenuItem","addNoticeIcon","_this2","form","FormData","scriptFields","_iterator","entries","_step","field","_validateScriptName2","robotsTemplate","_getRobotsTemplate2","setTemplateValues","_validateConstants2","getConstants","collectUsages","Constant","ajax","runComponentAction","analyticsLabel","ID","script","serialize","then","result","status","isArrayFilled","errors","markModified","isFunction","_this3","querySelectorAll","forEach","el","menuActivateHandler","getAttribute","UI","DropdownMenuItem","getItemByNode","page","_this4","hasClass","showConfigsHandler","configsNode","_this5","clean","constants","parameters","getParameters","robotNodes","robots","robot","node","renderRobotConfigBlock","push","append","Tag","render","taggedTemplateLiteral","Loc","getMessage","_this6","usages","itemNodes","size","Parameter","constId","constant","find","c","Id","renderPropertyBlock","constantPrefix","paramId","parameter","p","parameterPrefix","Text","encode","getTitle","property","prefix","control","FieldType","renderControlPublic","document","getRawType","Default","Name","Description","changePropertyDescription","event","_this7","element","currentTarget","wrapper","previousElementSibling","hide","inputElement","focus","applyNewDescription","text","trim","textContent","show","updateConstant","updateParameter","keyCode","unbind","template","_this8","querySelector","setConstantValue","get","param","setParameterValue","templateManager","templates","_activateSection2","section","menuItem","concat","setActiveHandler","Notification","Center","notify","content","usedConstants","window"],"mappings":"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","file":"script.map.js"}