{"version":3,"sources":["ui.icons.generator.bundle.js"],"names":["this","BX","UI","Icons","exports","main_core","FileType","babelHelpers","classCallCheck","defineProperty","_classPrivateMethodGet","receiver","privateSet","fn","has","TypeError","presets","RAR","color","fileType","ZIP","GZIP","GZ","JPG","JPEG","WEBP","GIF","PNG","MOV","3GP","WEBM","AVI","MP3","WAV","PHP","PDF","PSD","TXT","DOC","DOCX","PPT","PPTX","XLS","XLSX","none","_createSvgElement","WeakSet","FileIcon","iconOptions","add","options","Type","isPlainObject","name","align","isStringFilled","size","isNumber","setColor","setName","setType","createClass","key","value","preset","length","toUpperCase","generate","iconSize","viewBoxParam","container","_createSvgElement2","call","width","viewBox","style","fill","path1","fill-rule","clip-rule","d","path2","opacity","appendChild","ARCHIVE","iconType","MEDIA","_iconType","PICTURE","_iconType2","nameNode","height","x","y","rect","text","dominant-baseline","text-anchor","textNode","document","createTextNode","generateURI","encodeURIComponent","outerHTML","renderTo","node","isDomNode","tag","params","element","createElementNS","setAttribute","property","setAttributeNS","Generator"],"mappings":"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","file":"ui.icons.generator.bundle.map.js"}