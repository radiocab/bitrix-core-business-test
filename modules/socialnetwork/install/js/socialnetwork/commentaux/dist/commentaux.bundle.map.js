{"version":3,"sources":["commentaux.bundle.js"],"names":["exports","main_core","main_core_events","socialnetwork_renderparts","CommentAux","babelHelpers","classCallCheck","this","createClass","key","value","init","params","EventEmitter","emit","BaseEvent","compatData","RenderParts","isSourcePost","eventType","postEventTypeList","includes","isSourceComment","commentEventTypeList","getTypesList","Object","values","typesList","getLiveTypesList","createentity","createtask","fileversion","taskinfo","getLiveText","type","_this","result","sourceEntityType","sourceEntityLink","suffix","toLowerCase","share","Type","isPlainObject","length","Loc","getMessage","replace","getShareList","isStringFilled","entityType","isUndefined","entityId","parseInt","entityName","sourceEntityId","renderEntity","ENTITY_TYPE","NAME","LINK","entityUrl","VISIBILITY","getEntityVisibility","mobile","concat","getEntityCreatedMessage","taskId","taskName","task","taskUrl","userId","taskResponsibleId","messageType","isEnabledKeepVersion","userGenderSuffix","userGender","JSON","textList","partsData","parse","Text","decode","e","isArray","forEach","partsItems","item","messageCode","push","CODE","REPLACE_LIST","join","_this2","renderedShareList","entity","toUpperCase","getNodeU","getNodeUA","getNodeSG","getNodeDR","getNodeTask","getNodePost","getNodeCalendarEvent","getTaskCommentPart","tmp","Dom","create","children","innerHTML","clean","remove","getEntityTypeName","currentUserId","available","socNetPermissions","indexOf","attendees","defineProperty","BX","Event"],"mappings":"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","file":"commentaux.bundle.map.js"}