{"version":3,"sources":["attach.bundle.js"],"names":["exports","ui_icons_disk","ui_vue_directives_lazyload","im_model","im_lib_utils","ui_vue","AttachTypeDelimiter","property","name","component","props","config","type","Object","default","color","String","computed","styles","width","this","DELIMITER","SIZE","backgroundColor","COLOR","template","AttachTypeFile","methods","openLink","element","Utils","platform","openNewPage","LINK","file","FILE","NAME","extension","split","splice","size","fileName","maxLength","length","endWordLength","secondPart","substring","firstPart","trim","fileNameFull","fileSize","sizes","position","Math","round","$Bitrix","Loc","getMessage","fileIcon","FilesModel","getIconType","AttachLinks","event","eventData","isBitrixMobile","target","tagName","entity","id","hasOwnProperty","USER_ID","CHAT_ID","window","top","popupAngle","BX","MessengerTheme","isDark","messenger","openPopupExternalData","ID","navigator","userAgent","toLowerCase","includes","dialogId","concat","BXMobileApp","Events","postToComponent","AttachTypeGrid","mixins","created","maxCellWith","floor","min","screen","availWidth","availHeight","getWidth","DISPLAY","WIDTH","VALUE","getValue","_this","text","htmlspecialchars","replace","whole","userId","userName","user","$store","getters","MessagesModel","decodeBbCode","AttachTypeHtml","AttachTypeImage","open","UI","Photo","show","photos","url","default_photo","getImageSize","height","maxWidth","aspectRatio","getElementSource","PREVIEW","getElementTitle","htmlspecialcharsback","lazyLoadCallback","style","offsetWidth","offsetHeight","styleFileSizes","image","HEIGHT","maxHeight","backgroundSize","styleBoxSizes","parseInt","AttachTypeLink","getImageConfig","IMAGE","getLinkName","imageComponentName","components","babelHelpers","defineProperty","AttachTypeMessage","message","MESSAGE","AttachTypeRich","AttachTypeUser","getAvatarType","AVATAR","avatarType","AVATAR_TYPE","_createForOfIteratorHelper","o","allowArrayLike","it","Symbol","iterator","Array","isArray","_unsupportedIterableToArray","i","F","s","n","done","value","e","_e","f","TypeError","normalCompletion","didErr","err","step","next","_e2","return","minLen","_arrayLikeToArray","prototype","toString","call","slice","constructor","from","test","arr","len","arr2","AttachTypes","AttachComponents","forEach","attachType","BitrixVue","baseColor","getComponentForBlock","block","_iterator","_step","Messenger","Model","Lib"],"mappings":"CAAC,SAAUA,EAAQC,EAAcC,EAA2BC,EAASC,EAAaC,GACjF,aAYA,IAAIC,GACFC,SAAU,YACVC,KAAM,sCACNC,WACEC,OACEC,QACEC,KAAMC,OACNC,YAEFC,OACEH,KAAMI,OACNF,QAAS,gBAGbG,UACEC,OAAQ,SAASA,IACf,OACEC,MAAOC,KAAKT,OAAOU,UAAUC,KAAOF,KAAKT,OAAOU,UAAUC,KAAO,KAAO,GACxEC,gBAAiBH,KAAKT,OAAOU,UAAUG,MAAQJ,KAAKT,OAAOU,UAAUG,MAAQJ,KAAKL,SAIxFU,SAAU,4EAcd,IAAIC,GACFnB,SAAU,OACVC,KAAM,4BACNC,WACEC,OACEC,QACEC,KAAMC,OACNC,YAEFC,OACEH,KAAMI,OACNF,QAAS,gBAGba,SACEC,SAAU,SAASA,EAASC,GAC1BzB,EAAa0B,MAAMC,SAASC,YAAYH,EAAQI,OAElDC,KAAM,SAASA,IACb,OACE1B,KAAMY,KAAKT,OAAOwB,KAAKC,KACvBC,UAAWjB,KAAKT,OAAOwB,KAAKC,KAAKE,MAAM,KAAKC,QAAQ,GAAG,GACvDC,KAAMpB,KAAKT,OAAOwB,KAAKb,OAG3BmB,SAAU,SAASA,EAASZ,GAC1B,IAAIa,EAAY,GAEhB,IAAKb,EAAQO,MAAQP,EAAQO,KAAKO,OAASD,EAAW,CACpD,OAAOb,EAAQO,KAGjB,IAAIQ,EAAgB,GACpB,IAAIP,EAAYR,EAAQO,KAAKE,MAAM,KAAKC,QAAQ,GAAG,GACnD,IAAIM,EAAahB,EAAQO,KAAKU,UAAUjB,EAAQO,KAAKO,OAAS,GAAKN,EAAUM,OAAS,EAAIC,IAC1F,IAAIG,EAAYlB,EAAQO,KAAKU,UAAU,EAAGJ,EAAYG,EAAWF,OAAS,GAC1E,OAAOI,EAAUC,OAAS,MAAQH,EAAWG,QAE/CC,aAAc,SAASA,EAAapB,GAClC,OAAOA,EAAQO,MAEjBc,SAAU,SAASA,EAASrB,GAC1B,IAAIW,EAAOX,EAAQP,KAEnB,GAAIkB,GAAQ,EAAG,CACb,MAAO,GAGT,IAAIW,GAAS,OAAQ,KAAM,KAAM,KAAM,MACvC,IAAIC,EAAW,EAEf,MAAOZ,GAAQ,MAAQY,EAAW,EAAG,CACnCZ,GAAQ,KACRY,IAGF,OAAOC,KAAKC,MAAMd,GAAQ,IAAMpB,KAAKmC,QAAQC,IAAIC,WAAW,iCAAmCN,EAAMC,KAEvGM,SAAU,SAASA,EAAS7B,GAC1B,OAAO1B,EAASwD,WAAWC,YAAY/B,EAAQO,KAAKE,MAAM,KAAKC,QAAQ,GAAG,MAG9Ed,SAAU,ywBAId,IAAIoC,GACFlC,SACEC,SAAU,SAASA,EAASkC,GAC1B,IAAIjC,EAAUiC,EAAMjC,QACpB,IAAIkC,EAAYD,EAAMA,MAEtB,IAAK1D,EAAa0B,MAAMC,SAASiC,kBAAoBnC,EAAQI,KAAM,CACjE,OAGF,GAAIJ,EAAQI,MAAQ8B,EAAUE,OAAOC,UAAY,IAAK,CACpD9D,EAAa0B,MAAMC,SAASC,YAAYH,EAAQI,WAC3C,IAAKJ,EAAQI,KAAM,CACxB,IAAIkC,GACFC,GAAI,KACJxD,KAAM,MAGR,GAAIiB,EAAQwC,eAAe,YAAcxC,EAAQyC,QAAU,EAAG,CAC5DH,EAAOC,GAAKvC,EAAQyC,QACpBH,EAAOvD,KAAO,OAGhB,GAAIiB,EAAQwC,eAAe,YAAcxC,EAAQ0C,QAAU,EAAG,CAC5DJ,EAAOC,GAAKvC,EAAQ0C,QACpBJ,EAAOvD,KAAO,OAGhB,GAAIuD,EAAOC,IAAMD,EAAOvD,MAAQ4D,OAAOC,IAAI,QAAS,CAClD,IAAIC,GAAcC,GAAGC,eAAeC,SACpCL,OAAOC,IAAI,QAAQK,UAAUC,sBAAsBhB,EAAUE,OAAQE,EAAOvD,KAAM8D,GAChFM,GAAMb,EAAOC,UAEV,GAAIa,UAAUC,UAAUC,cAAcC,SAAS,gBAAiB,CACrE,IAAIC,EAAW,GAEf,GAAIlB,EAAOvD,OAAS,OAAQ,CAC1ByE,EAAW,OAAOC,OAAOnB,EAAOC,QAC3B,CACLiB,EAAWlB,EAAOC,GAGpB,GAAIiB,IAAa,GAAI,CACnBE,YAAYC,OAAOC,gBAAgB,iBACjCJ,SAAUA,GACT,MAAO,mBAkBtB,IAAIK,GACFnF,SAAU,OACVC,KAAM,iCACNC,WACEkF,QAAS9B,GACTnD,OACEC,QACEC,KAAMC,OACNC,YAEFC,OACEH,KAAMI,OACNF,QAAS,gBAGb8E,QAAS,SAASA,IAChB,GAAIxF,EAAa0B,MAAMC,SAASiC,iBAAkB,CAChD5C,KAAKyE,YAAcxC,KAAKyC,MAAMzC,KAAK0C,IAAIC,OAAOC,WAAYD,OAAOE,aAAe,OAC3E,CACL9E,KAAKyE,YAAc,OAGvBlE,SACEwE,SAAU,SAASA,EAAStE,GAC1B,GAAIA,EAAQuE,UAAY,MAAO,CAC7B,OAAOvE,EAAQwE,MAAQxE,EAAQwE,MAAQ,KAAO,GAGhD,IAAKxE,EAAQyE,MAAO,CAClB,OAAO,MAGT,GAAIlF,KAAKyE,aAAehE,EAAQwE,MAAQjF,KAAKyE,YAAa,CACxD,OAAOzE,KAAKyE,YAAc,KAG5B,OAAOhE,EAAQwE,MAAQxE,EAAQwE,MAAQ,KAAO,IAEhDE,SAAU,SAASA,EAAS1E,GAC1B,IAAI2E,EAAQpF,KAEZ,IAAKS,EAAQyE,MAAO,CAClB,MAAO,GAGT,IAAIG,EAAOrG,EAAa0B,MAAM2E,KAAKC,iBAAiB7E,EAAQyE,OAC5DG,EAAOA,EAAKE,QAAQ,wCAAyC,SAAUC,EAAOC,EAAQC,GACpF,IAAIC,EAAOP,EAAMQ,OAAOC,QAAQ,aAAaJ,GAE7CC,EAAWC,EAAO3G,EAAa0B,MAAM2E,KAAKC,iBAAiBK,EAAKvG,MAAQsG,EACxE,MAAO,4DAA8DD,EAAS,KAAOC,EAAW,YAElG,OAAO3G,EAAS+G,cAAcC,cAC5BV,KAAMA,MAKZhF,SAAU,8rHAcd,IAAI2F,GACF7G,SAAU,OACVC,KAAM,iCACNC,WACEC,OACEC,QACEC,KAAMC,OACNC,YAEFC,OACEH,KAAMI,OACNF,QAAS,gBAGbW,SAAU,4EAcd,IAAI4F,GACF9G,SAAU,QACVC,KAAM,kCACNC,WACEC,OACEC,QACEC,KAAMC,OACNC,YAEFC,OACEH,KAAMI,OACNF,QAAS,gBAGba,SACE2F,KAAM,SAASA,EAAKpF,GAClB,IAAKA,EAAM,CACT,OAAO,MAGT,GAAI9B,EAAa0B,MAAMC,SAASiC,iBAAkB,CAEhDuB,YAAYgC,GAAGC,MAAMC,MACnBC,SACEC,IAAKzF,IAEP0F,cAAe1F,QAEZ,CACLsC,OAAO8C,KAAKpF,EAAM,YAGtB2F,aAAc,SAASA,EAAa1G,EAAO2G,EAAQC,GACjD,IAAIC,EAEJ,GAAI7G,EAAQ4G,EAAU,CACpBC,EAAcD,EAAW5G,MACpB,CACL6G,EAAc,EAGhB,OACE7G,MAAOA,EAAQ6G,EACfF,OAAQA,EAASE,IAGrBC,iBAAkB,SAASA,EAAiBpG,GAC1C,OAAOA,EAAQqG,QAAUrG,EAAQqG,QAAUrG,EAAQI,MAErDkG,gBAAiB,SAASA,EAAgBtG,GACxC,OAAOzB,EAAa0B,MAAM2E,KAAK2B,qBAAqBvG,EAAQO,OAE9DiG,iBAAkB,SAASA,EAAiBvE,GAC1C,IAAKA,EAAMjC,QAAQyG,MAAMnH,MAAO,CAC9B2C,EAAMjC,QAAQyG,MAAMnH,MAAQ2C,EAAMjC,QAAQ0G,YAAc,KAG1D,IAAKzE,EAAMjC,QAAQyG,MAAMR,OAAQ,CAC/BhE,EAAMjC,QAAQyG,MAAMR,OAAShE,EAAMjC,QAAQ2G,aAAe,OAG9DC,eAAgB,SAASA,EAAeC,GACtC,KAAMA,EAAMrC,OAASqC,EAAMC,QAAS,CAClC,OACEC,UAAW,OACXC,eAAgB,WAIpB,IAAI1F,EAAQ/B,KAAKyG,aAAaa,EAAMrC,MAAOqC,EAAMC,OAAQ,KACzD,OACExH,MAAOgC,EAAMhC,MAAQ,KACrB2G,OAAQ3E,EAAM2E,OAAS,KACvBe,eAAgB1F,EAAMhC,MAAQ,KAAOgC,EAAM2E,OAAS,IAAM,UAAY,YAG1EgB,cAAe,SAASA,EAAcJ,GACpC,KAAMA,EAAMrC,OAASqC,EAAMC,QAAS,CAClC,OACEb,OAAQ,SAIZ,GAAIiB,SAAS3H,KAAKqH,eAAeC,GAAOZ,SAAW,IAAK,CACtD,SAGF,OACEA,OAAQ,WAIdrG,SAAU,0lBAcd,IAAIuH,GACFzI,SAAU,OACVC,KAAM,iCACNC,WACEkF,QAAS9B,GACTnD,OACEC,QACEC,KAAMC,OACNC,YAEFC,OACEH,KAAMI,OACNF,QAAS,gBAGba,SACEsH,eAAgB,SAASA,EAAepH,GACtC,OACEqH,QACE9G,KAAMP,EAAQO,KACd8F,QAASrG,EAAQqG,QACjB7B,MAAOxE,EAAQwE,MACfsC,OAAQ9G,EAAQ8G,WAItBQ,YAAa,SAASA,EAAYtH,GAChC,OAAOA,EAAQO,KAAOP,EAAQO,KAAOP,EAAQI,OAGjDhB,UACEmI,mBAAoB,SAASA,IAC3B,OAAO/B,EAAgB7G,OAG3B6I,WAAYC,aAAaC,kBAAmBlC,EAAgB7G,KAAM6G,EAAgB5G,WAElFgB,SAAU,8tCAcd,IAAI+H,GACFjJ,SAAU,UACVC,KAAM,oCACNC,WACEC,OACEC,QACEC,KAAMC,OACNC,YAEFC,OACEH,KAAMI,OACNF,QAAS,gBAGbG,UACEwI,QAAS,SAASA,IAChB,IAAIjD,EAAQpF,KAEZ,IAAIqF,EAAOrG,EAAa0B,MAAM2E,KAAKC,iBAAiBtF,KAAKT,OAAO+I,SAChEjD,EAAOA,EAAKE,QAAQ,wCAAyC,SAAUC,EAAOC,EAAQC,GACpF,IAAIC,EAAOP,EAAMQ,OAAOC,QAAQ,aAAaJ,GAE7CC,EAAWC,EAAO3G,EAAa0B,MAAM2E,KAAKC,iBAAiBK,EAAKvG,MAAQsG,EACxE,MAAO,4DAA8DD,EAAS,KAAOC,EAAW,YAElG,OAAO3G,EAAS+G,cAAcC,cAC5BV,KAAMA,MAIZhF,SAAU,2EAcd,IAAIkI,GACFpJ,SAAU,YACVC,KAAM,iCACNC,WACEkF,QAAS9B,GACTnD,OACEC,QACEC,KAAMC,OACNC,YAEFC,OACEH,KAAMI,OACNF,QAAS,gBAGba,SACEsH,eAAgB,SAASA,EAAepH,GACtC,OACEqH,QACE9G,KAAMP,EAAQO,KACd8F,QAASrG,EAAQqG,QACjB7B,MAAOxE,EAAQwE,MACfsC,OAAQ9G,EAAQ8G,YAKxB1H,UACEmI,mBAAoB,SAASA,IAC3B,OAAO/B,EAAgB7G,OAG3B6I,WAAYC,aAAaC,kBAAmBlC,EAAgB7G,KAAM6G,EAAgB5G,WAElFgB,SAAU,2vBAcd,IAAImI,GACFrJ,SAAU,OACVC,KAAM,iCACNC,WACEkF,QAAS9B,GACTnD,OACEC,QACEC,KAAMC,OACNC,YAEFC,OACEH,KAAMI,OACNF,QAAS,gBAGba,SACEkI,cAAe,SAASA,EAAchI,GACpC,GAAIA,EAAQiI,OAAQ,CAClB,MAAO,GAGT,IAAIC,EAAa,OAEjB,GAAIlI,EAAQmI,cAAgB,OAAQ,CAClCD,EAAa,YACR,GAAIlI,EAAQmI,cAAgB,MAAO,CACxCD,EAAa,MAGf,MAAO,8CAAgDA,IAI3DtI,SAAU,4pCAId,SAASwI,EAA2BC,EAAGC,GAAkB,IAAIC,EAAI,UAAWC,SAAW,aAAeH,EAAEG,OAAOC,WAAa,KAAM,CAAE,GAAIC,MAAMC,QAAQN,KAAOE,EAAKK,EAA4BP,KAAOC,GAAkBD,UAAYA,EAAEvH,SAAW,SAAU,CAAE,GAAIyH,EAAIF,EAAIE,EAAI,IAAIM,EAAI,EAAG,IAAIC,EAAI,SAASA,MAAQ,OAASC,EAAGD,EAAGE,EAAG,SAASA,IAAM,GAAIH,GAAKR,EAAEvH,OAAQ,OAASmI,KAAM,MAAQ,OAASA,KAAM,MAAOC,MAAOb,EAAEQ,OAAWM,EAAG,SAASA,EAAEC,GAAM,MAAMA,GAAOC,EAAGP,GAAO,MAAM,IAAIQ,UAAU,yIAA4I,IAAIC,EAAmB,KAAMC,EAAS,MAAOC,EAAK,OAASV,EAAG,SAASA,IAAMR,EAAKF,EAAEG,OAAOC,aAAgBO,EAAG,SAASA,IAAM,IAAIU,EAAOnB,EAAGoB,OAAQJ,EAAmBG,EAAKT,KAAM,OAAOS,GAASP,EAAG,SAASA,EAAES,GAAOJ,EAAS,KAAMC,EAAMG,GAAQP,EAAG,SAASA,IAAM,IAAM,IAAKE,GAAoBhB,EAAGsB,QAAU,KAAMtB,EAAGsB,SAAY,QAAU,GAAIL,EAAQ,MAAMC,KAEl9B,SAASb,EAA4BP,EAAGyB,GAAU,IAAKzB,EAAG,OAAQ,UAAWA,IAAM,SAAU,OAAO0B,EAAkB1B,EAAGyB,GAAS,IAAId,EAAIhK,OAAOgL,UAAUC,SAASC,KAAK7B,GAAG8B,MAAM,GAAI,GAAI,GAAInB,IAAM,UAAYX,EAAE+B,YAAapB,EAAIX,EAAE+B,YAAYzL,KAAM,GAAIqK,IAAM,OAASA,IAAM,MAAO,OAAON,MAAM2B,KAAKhC,GAAI,GAAIW,IAAM,aAAe,2CAA2CsB,KAAKtB,GAAI,OAAOe,EAAkB1B,EAAGyB,GAEtZ,SAASC,EAAkBQ,EAAKC,GAAO,GAAIA,GAAO,MAAQA,EAAMD,EAAIzJ,OAAQ0J,EAAMD,EAAIzJ,OAAQ,IAAK,IAAI+H,EAAI,EAAG4B,EAAO,IAAI/B,MAAM8B,GAAM3B,EAAI2B,EAAK3B,IAAK,CAAE4B,EAAK5B,GAAK0B,EAAI1B,GAAM,OAAO4B,EAChL,IAAIC,GAAejM,EAAqBoB,EAAgBgE,EAAgB0B,EAAgBC,EAAiB2B,EAAgBQ,EAAmBG,EAAgBC,GAC5J,IAAI4C,KACJD,EAAYE,QAAQ,SAAUC,GAC5BF,EAAiBE,EAAWlM,MAAQkM,EAAWjM,YAEjDJ,EAAOsM,UAAUlM,UAAU,6BACzBC,OACEC,QACEC,KAAMC,OACNC,YAEF8L,WACEhM,KAAMI,OACNF,QAAS,YAGba,SACEkL,qBAAsB,SAASA,EAAqBC,GAClD,IAAIC,EAAY9C,EAA2BsC,GACvCS,EAEJ,IACE,IAAKD,EAAUnC,MAAOoC,EAAQD,EAAUlC,KAAKC,MAAO,CAClD,IAAI4B,EAAaM,EAAMjC,MAEvB,UAAW+B,EAAMJ,EAAWnM,YAAc,YAAa,CACrD,OAAOmM,EAAWlM,OAGtB,MAAO8K,GACPyB,EAAU/B,EAAEM,GACZ,QACAyB,EAAU7B,IAGZ,MAAO,KAGXjK,UACEF,MAAO,SAASA,IACd,UAAWK,KAAKT,OAAOa,QAAU,cAAgBJ,KAAKT,OAAOa,MAAO,CAClE,OAAOJ,KAAKwL,UAGd,GAAIxL,KAAKT,OAAOa,QAAU,cAAe,CACvC,MAAO,GAGT,OAAOJ,KAAKT,OAAOa,QAGvB6H,WAAYmD,EACZ/K,SAAU,wZA7mBb,CAgnBGL,KAAKoD,OAASpD,KAAKoD,WAAcG,GAAGH,OAAOG,GAAGsI,UAAUC,MAAMvI,GAAGsI,UAAUE,IAAIxI","file":"attach.bundle.map.js"}