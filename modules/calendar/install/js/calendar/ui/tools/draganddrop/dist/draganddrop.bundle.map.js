{"version":3,"file":"draganddrop.bundle.map.js","names":["this","BX","Calendar","Ui","exports","calendar_util","EventDragAndDrop","constructor","getDateByPos","getPosByDate","getEvents","maxTryDuration","stickDistanceInPercents","magnetizeDistanceInMinutes","setFinalTimeInterval","from","to","finalFrom","Date","getTime","finalTo","getFinalFrom","getFinalTo","onDragStart","duration","startPosition","savedDuration","tryDuration","startBoundary","getBoundaryFromPositionAndDuration","getDragBoundary","position","diff","previousPosition","calculateTryDuration","resetMagnetStamps","boundary","doMagnetize","getMagnetizedBoundary","size","wasMagnetized","magnetizedTimeInterval","getMagnetizedTimeInterval","magnetizedFromPosition","wasMagnetizedTo","wasMagnetizedFrom","endMagnetStamp","startMagnetStamp","fromDate","toDate","magnetDistance","stickDistance","fromDateMax","setHours","toDateMin","events","event","eventFrom","eventTo","Math","abs","Util","isAnyModifierKeyPressed","isUserTryingToTurnOffMagnet","ResizeDragAndDrop","timeInterval","minSize","isStartResizer","direction","positionStart","positionEnd","dy","max","timeFrom","getHours","getMinutes","timeTo","Tools"],"sources":["draganddrop.bundle.js"],"mappings":"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"}