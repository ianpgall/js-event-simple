var addEvent = (function () {
	"use strict";

	var tester, allHandlers, attachGenerator, addFunc, removeFunc;

	tester = document.createElement("div");
	allHandlers = [];

	attachGenerator = function (el, cb) {
		var ret;
		ret = function (e) {
			var result;
			e = e || window.event;
			result = cb.call(el, e);
			if (result === false) {
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
			}
		};
		return ret;
	};

	if (tester.addEventListener) {
		addFunc = function (element, eventName, callback) {
			allHandlers.push({
				element: element,
				eventName: eventName,
				callback: callback
			});
			element.addEventListener(eventName, callback, false);
		};
		removeFunc = function (element, eventName, callback) {
			element.removeEventListener(eventName, callback);
		};
	} else if (tester.attachEvent) {
		addFunc = function (element, eventName, callback) {
			var finalCallback;
			finalCallback = attachGenerator(element, callback);
			allHandlers.push({
				element: element,
				eventName: eventName,
				callback: finalCallback
			});
			element.attachEvent("on" + eventName, finalCallback);
		};
		removeFunc = function (element, eventName, callback) {
			element.detachEvent("on" + eventName, callback);
		};
	}

	addFunc(window, "unload", function () {
		var i, j, cur;
		// Don't remove this unload handler
		for (i = 1, j = allHandlers.length; i < j; i++) {
			cur = allHandlers[i];
			removeFunc(cur.element, cur.eventName, cur.callback);
		}
	});

	return addFunc;
}());
