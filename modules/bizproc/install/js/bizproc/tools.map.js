{"version":3,"file":"tools.map.js","names":["BX","namespace","Bizproc","doInlineTask","parameters","callback","scope","__waiting","hasClass","addClass","bitrix_sessid","ajax","method","dataType","url","data","onsuccess","response","ERROR","window","alert","removeClass","SUCCESS","arguments","taskPopupInstance","taskPopupCallback","showTaskPopup","taskId","userId","useIframe","message","HTML","wrapper","create","style","width","innerHTML","title","titleNode","findChild","className","textContent","remove","PopupWindow","Math","round","random","content","closeIcon","titleBar","contentColor","contentNoPaddings","zIndex","offsetLeft","offsetTop","closeByEsc","draggable","restrict","overlay","backgroundColor","opacity","events","onPopupClose","popup","destroy","delegationPopup","load","show","delegationSelected","showDelegationPopup","lightShadow","autoHide","bindOptions","forceBindPosition","angle","position","offset","buttons","PopupWindowButton","text","click","e","delegateTask","close","PopupWindowButtonLink","event","PreventDefault","delegationOnSelect","user","id","fromUserId","toUserId","SITE_ID","action","sessid","task_id","from_user_id","to_user_id","success","location","reload","showWorkflowInfoPopup","workflowId","showWorkflowLogPopup","params","type","isPlainObject","postTaskForm","form","BPRUNNING","actionName","actionValue","btn","document","activeElement","explicitOriginalTarget","toLowerCase","name","value","target","BXFormTarget","frame_name","body","appendChild","props","src","display","property","BXFormCallback","parseJSON","bind","proxy","_submit_callback","submit","WorkflowFaces","showFaces","tasks","simple","taskBased","__popup","createMenu","isShown","i","k","s","length","l","tasksContent","cls","task","uContent","USERS","STATUS","tpl","PHOTO_SRC","FULL_NAME","push","join","usersMenu","taskHead","NAME"],"sources":["tools.js"],"mappings":"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"}