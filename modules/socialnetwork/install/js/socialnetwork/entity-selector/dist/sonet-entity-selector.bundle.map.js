{"version":3,"sources":["sonet-entity-selector.bundle.js"],"names":["this","BX","SocialNetwork","exports","main_core","main_core_events","ui_entitySelector","_templateObject6","data","babelHelpers","taggedTemplateLiteral","_templateObject5","_templateObject4","_templateObject3","_templateObject2","_templateObject","Footer","_DefaultFooter","inherits","dialog","options","_this","classCallCheck","possibleConstructorReturn","getPrototypeOf","call","handleDialogDestroy","bind","assertThisInitialized","handleSliderMessage","bindEvents","createClass","key","value","getContent","_this2","cache","remember","inviteEmployeeLink","getOption","inviteGuestLink","phrase","Tag","render","Loc","getMessage","employee","querySelector","guest","spans","Array","from","querySelectorAll","replaceChild","handleInviteEmployeeClick","innerHTML","guestLink","handleInviteGuestClick","createHint","forEach","span","fragment","document","createDocumentFragment","childNodes","element","appendChild","_guestLink","link","_this3","Runtime","loadExtension","then","hint","UI","Hint","createInstance","popupParameters","zIndex","getDialog","getZindex","node","createNode","Dom","insertAfter","Type","isStringFilled","SidePanel","Instance","open","allowChangeHistory","cacheable","entitySelectorId","getId","entity","getEntity","userOptions","getOptions","rows","searchQuery","getTagSelectorQuery","Validation","isEmail","push","email","width","requestMethod","requestParams","componentParams","JSON","stringify","USER_OPTIONS","ROWS","subscribe","EventEmitter","unbindEvents","unsubscribe","event","_event$getData","getData","_event$getData2","slicedToArray","messageEvent","slider","getSender","get","getEventId","_messageEvent$getData","users","addUsers","_this4","isArrayFilled","tab","getRecentTab","getTab","addTab","createTab","user","isPlainObject","item","addItem","Object","assign","tabs","sort","select","selectTab","icon","id","title","bgColor","selected","selectedHovered","default","replace","DefaultFooter","EntitySelector","Event"],"mappings":"AAAAA,KAAKC,GAAKD,KAAKC,OACfD,KAAKC,GAAGC,cAAgBF,KAAKC,GAAGC,mBAC/B,SAAUC,EAAQC,EAAUC,EAAiBC,GAC7C,aAEA,SAASC,IACP,IAAIC,EAAOC,aAAaC,uBAAuB,wGAA4G,KAAO,sBAElKH,EAAmB,SAASA,IAC1B,OAAOC,GAGT,OAAOA,EAGT,SAASG,IACP,IAAIH,EAAOC,aAAaC,uBAAuB,sHAA0H,KAAO,sBAEhLC,EAAmB,SAASA,IAC1B,OAAOH,GAGT,OAAOA,EAGT,SAASI,IACP,IAAIJ,EAAOC,aAAaC,uBAAuB,gDAAmD,YAElGE,EAAmB,SAASA,IAC1B,OAAOJ,GAGT,OAAOA,EAGT,SAASK,IACP,IAAIL,EAAOC,aAAaC,uBAAuB,0FAA8F,KAAO,sBAEpJG,EAAmB,SAASA,IAC1B,OAAOL,GAGT,OAAOA,EAGT,SAASM,IACP,IAAIN,EAAOC,aAAaC,uBAAuB,4HAAgI,KAAO,wBAEtLI,EAAmB,SAASA,IAC1B,OAAON,GAGT,OAAOA,EAGT,SAASO,IACP,IAAIP,EAAOC,aAAaC,uBAAuB,QAAS,WAExDK,EAAkB,SAASA,IACzB,OAAOP,GAGT,OAAOA,EAGT,IAAIQ,EAAsB,SAAUC,GAClCR,aAAaS,SAASF,EAAQC,GAE9B,SAASD,EAAOG,EAAQC,GACtB,IAAIC,EAEJZ,aAAaa,eAAetB,KAAMgB,GAClCK,EAAQZ,aAAac,0BAA0BvB,KAAMS,aAAae,eAAeR,GAAQS,KAAKzB,KAAMmB,EAAQC,IAC5GC,EAAMK,oBAAsBL,EAAMK,oBAAoBC,KAAKlB,aAAamB,sBAAsBP,IAC9FA,EAAMQ,oBAAsBR,EAAMQ,oBAAoBF,KAAKlB,aAAamB,sBAAsBP,IAE9FA,EAAMS,aAEN,OAAOT,EAGTZ,aAAasB,YAAYf,IACvBgB,IAAK,aACLC,MAAO,SAASC,IACd,IAAIC,EAASnC,KAEb,OAAOA,KAAKoC,MAAMC,SAAS,UAAW,WACpC,IAAIC,EAAqBH,EAAOI,UAAU,sBAE1C,IAAIC,EAAkBL,EAAOI,UAAU,mBAEvC,GAAID,GAAsBE,EAAiB,CACzC,IAAIC,EAASrC,EAAUsC,IAAIC,OAAO5B,IAAmBX,EAAUwC,IAAIC,WAAW,oDAC9E,IAAIC,EAAWL,EAAOM,cAAc,YACpC,IAAIC,EAAQP,EAAOM,cAAc,SACjC,IAAIE,EAAQC,MAAMC,KAAKV,EAAOW,iBAAiB,SAC/CX,EAAOY,aAAajD,EAAUsC,IAAIC,OAAO7B,IAAoBqB,EAAOmB,0BAA0B3B,KAAKQ,GAASW,EAASS,WAAYT,GACjI,IAAIU,EAAYpD,EAAUsC,IAAIC,OAAO9B,IAAoBsB,EAAOsB,uBAAuB9B,KAAKQ,GAASa,EAAMO,WAC3Gd,EAAOY,aAAaG,EAAWR,GAE/Bb,EAAOuB,WAAWF,GAElBP,EAAMU,QAAQ,SAAUC,GACtBnB,EAAOY,aAAajD,EAAUsC,IAAIC,OAAO/B,IAAoBgD,EAAKL,WAAYK,KAGhF,IAAIC,EAAWC,SAASC,yBACxBb,MAAMC,KAAKV,EAAOuB,YAAYL,QAAQ,SAAUM,GAC9CJ,EAASK,YAAYD,KAEvB,OAAOJ,OACF,GAAIvB,EAAoB,CAC7B,OAAOlC,EAAUsC,IAAIC,OAAOhC,IAAoBwB,EAAOmB,0BAA0B3B,KAAKQ,GAAS/B,EAAUwC,IAAIC,WAAW,gDACnH,GAAIL,EAAiB,CAC1B,IAAI2B,EAAa/D,EAAUsC,IAAIC,OAAOpC,IAAoB4B,EAAOsB,uBAAuB9B,KAAKQ,GAAS/B,EAAUwC,IAAIC,WAAW,wCAE/HV,EAAOuB,WAAWS,GAElB,OAAOA,EAGT,OAAO,UAIXnC,IAAK,aACLC,MAAO,SAASyB,EAAWU,GACzB,IAAIC,EAASrE,KAEbI,EAAUkE,QAAQC,cAAc,WAAWC,KAAK,WAC9C,IAAIC,EAAOxE,GAAGyE,GAAGC,KAAKC,gBACpBC,iBACEC,OAAQT,EAAOU,YAAYC,YAAc,KAG7C,IAAIC,EAAOR,EAAKS,WAAW9E,EAAUwC,IAAIC,WAAW,8CACpDzC,EAAU+E,IAAIC,YAAYH,EAAMb,QAIpCpC,IAAK,4BACLC,MAAO,SAASqB,IACd,IAAIhB,EAAqBtC,KAAKuC,UAAU,sBACxC,IAAIuC,EAAS9E,KAAK+E,YAAYC,aAAe,IAAOhF,KAAK+E,YAAYC,YAAc,GAAK,KAExF,GAAI5E,EAAUiF,KAAKC,eAAehD,GAAqB,CACrDrC,GAAGsF,UAAUC,SAASC,KAAKnD,GACzBwC,OAAQA,EACRY,mBAAoB,MACpBC,UAAW,MACXnF,MACEoF,iBAAkB5F,KAAK+E,YAAYc,eAM3C7D,IAAK,yBACLC,MAAO,SAASwB,IACd,IAAIjB,EAAkBxC,KAAKuC,UAAU,mBACrC,IAAIuC,EAAS9E,KAAK+E,YAAYC,aAAe,IAAOhF,KAAK+E,YAAYC,YAAc,GAAK,KAExF,GAAI5E,EAAUiF,KAAKC,eAAe9C,GAAkB,CAClD,IAAIsD,EAAS9F,KAAK+E,YAAYgB,UAAU,QACxC,IAAIC,EAAcF,EAAOG,iBACzB,IAAIC,KACJ,IAAIC,EAAcnG,KAAK+E,YAAYqB,sBAEnC,GAAIhG,EAAUiG,WAAWC,QAAQH,GAAc,CAC7CD,EAAKK,MACHC,MAASL,IAIblG,GAAGsF,UAAUC,SAASC,KAAKjD,GACzBiE,MAAO,KACP3B,OAAQA,EACRY,mBAAoB,MACpBC,UAAW,MACXe,cAAe,OACfC,eACEC,gBAAiBC,KAAKC,WACpBC,aAAgBf,EAChBgB,KAAQd,KAGZ1F,MACEoF,iBAAkB5F,KAAK+E,YAAYc,eAM3C7D,IAAK,aACLC,MAAO,SAASH,IACd9B,KAAK+E,YAAYkC,UAAU,YAAajH,KAAK0B,qBAC7CrB,EAAiB6G,aAAaD,UAAU,6BAA8BjH,KAAK6B,wBAG7EG,IAAK,eACLC,MAAO,SAASkF,IACdnH,KAAK+E,YAAYqC,YAAY,YAAapH,KAAK0B,qBAC/CrB,EAAiB6G,aAAaE,YAAY,6BAA8BpH,KAAK6B,wBAG/EG,IAAK,sBACLC,MAAO,SAASP,IACd1B,KAAKmH,kBAGPnF,IAAK,sBACLC,MAAO,SAASJ,EAAoBwF,GAClC,IAAIC,EAAiBD,EAAME,UACvBC,EAAkB/G,aAAagH,cAAcH,EAAgB,GAC7DI,EAAeF,EAAgB,GAEnC,IAAIG,EAASD,EAAaE,YAE1B,GAAID,EAAOJ,UAAUM,IAAI,sBAAwB7H,KAAK+E,YAAYc,QAAS,CACzE,OAGF,GAAI6B,EAAaI,eAAiB,gCAAkCJ,EAAaI,eAAiB,qCAAsC,CACtI,IAAIC,EAAwBL,EAAaH,UACrCS,EAAQD,EAAsBC,MAElChI,KAAKiI,SAASD,OAIlBhG,IAAK,WACLC,MAAO,SAASgG,EAASD,GACvB,IAAIE,EAASlI,KAEb,IAAKI,EAAUiF,KAAK8C,cAAcH,GAAQ,CACxC,OAGF,IAAII,EAAMpI,KAAK+E,YAAYsD,gBAAkBrI,KAAK+E,YAAYuD,OAAO,iBAErE,IAAKF,EAAK,CACRA,EAAMpI,KAAK+E,YAAYwD,OAAOvI,KAAKwI,aAGrCR,EAAMrE,QAAQ,SAAU8E,GACtB,IAAKrI,EAAUiF,KAAKqD,cAAcD,GAAO,CACvC,OAGF,IAAIE,EAAOT,EAAOnD,YAAY6D,QAAQC,OAAOC,UAAWL,GACtDM,KAAMX,EAAIvC,QACVmD,KAAM,KAGR,GAAIL,EAAM,CACRA,EAAKM,YAGTjJ,KAAK+E,YAAYmE,UAAUd,EAAIvC,YAGjC7D,IAAK,YACLC,MAAO,SAASuG,IACd,IAAIW,EAAO,4FAA8F,+FAAiG,iGAAmG,gGAAkG,iGAAmG,mGAAqG,oGAAsG,mGAAqG,qGAAuG,sGAAwG,uGAAyG,sGAAwG,yEAClsC,OACEC,GAAI,gBACJC,MAAOjJ,EAAUwC,IAAIC,WAAW,kDAChCyG,SACEC,SAAU,UACVC,gBAAiB,WAEnBL,MAGEM,QAASN,EACTI,SAAUJ,EAAKO,QAAQ,UAAW,aAK1C,OAAO1I,EAvNiB,CAwNxBV,EAAkBqJ,eAEpBxJ,EAAQa,OAASA,GAzRlB,CA2RGhB,KAAKC,GAAGC,cAAc0J,eAAiB5J,KAAKC,GAAGC,cAAc0J,mBAAsB3J,GAAGA,GAAG4J,MAAM5J,GAAGyE,GAAGkF","file":"sonet-entity-selector.bundle.map.js"}