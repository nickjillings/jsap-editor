(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jsap-editor"] = factory();
	else
		root["jsap-editor"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/BasePluginEditorChannel.ts":
/*!****************************************!*\
  !*** ./src/BasePluginEditorChannel.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BasePluginEditorChannel)
/* harmony export */ });
/* harmony import */ var _ParameterListeners_EditorParameterManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ParameterListeners/EditorParameterManager */ "./src/ParameterListeners/EditorParameterManager.ts");
// jshint esversion: 6
/*
    JSAP Plugin GUI Channel object

    This object helps to abstract the various communication platforms in JSAP
    between the plugin processor (BasePlugin) and the GUI on top.
*/

class BasePluginEditorChannel {
    constructor() {
        this.unique_id = (function (len) {
            function dec2hex(dec) {
                return ('0' + dec.toString(16)).substr(-2);
            }
            var arr = new Uint8Array((len || 40) / 2);
            window.crypto.getRandomValues(arr);
            return Array.from(arr, dec2hex).join('');
        })(32);
        this.onparameterListeners = [];
        this.onlisteners = [];
        this.statelisteners = [];
        this.parameterListenerManager = new _ParameterListeners_EditorParameterManager__WEBPACK_IMPORTED_MODULE_0__["default"](this);
        if (window.opener) {
            // We are a popout window
            this.hostWindow = window.opener;
        }
        else if (window.parent) {
            this.hostWindow = window.parent;
        }
        window.onmessage = function (e) {
            if (e.source != this.hostWindow) {
                return;
            }
            if (e.data.sender_id == this.unique_id) {
                return;
            }
            let customEvent;
            switch (e.data.message) {
                case "updateParameters":
                    customEvent = new CustomEvent("parametersChanged", { detail: e.data });
                    break;
                case "updateState":
                    customEvent = new CustomEvent("updateState", { detail: e.data });
                    break;
                default:
                    return;
            }
            window.dispatchEvent(customEvent);
        };
        window.addEventListener("parametersChanged", (e) => {
            if (e.detail.parameters) {
                Object.keys(e.detail.parameters).forEach((name) => {
                    const listeners = this.onparameterListeners.filter((l) => {
                        return l.name.toLowerCase() == name.toLowerCase() || l.name === undefined;
                    });
                    listeners.forEach((l) => {
                        l.callback(e.detail.parameters[name]);
                    });
                });
                this.onlisteners.forEach((callback) => {
                    callback(e.detail.parameters);
                });
            }
        });
        window.addEventListener("updateState", (e) => {
            this.statelisteners.filter((listener) => {
                return (listener.level == e.detail.level) && (listener.term == e.detail.term);
            }).forEach(function (listener) {
                listener.callback(e.detail.value);
            });
        });
    }
    postMessage(object) {
        if (object === undefined || object.message === undefined) {
            throw ("Malformed message object");
        }
        object.sender_id = this.unique_id;
        this.hostWindow.postMessage(object, window.location.origin);
    }
    get pluginInstance() { return window.pluginInstance; }
    setParameterByName(name, value) {
        if (typeof name != "string") {
            throw ("Expects parameter name to be a string");
        }
        this.postMessage({
            message: "setParameterByName",
            parameter: {
                name: name,
                value: value
            }
        });
    }
    setParametersByObject(object) {
        postMessage({
            message: "setParametersByObject",
            parameters: object
        });
    }
    requestParameters() {
        postMessage({
            message: "requestParameters"
        });
    }
    requestParameterByName(name) {
        if (typeof name == "string") {
            postMessage({
                message: "requestParameters",
                name: name
            });
        }
        else {
            throw ("Name not set");
        }
    }
    listenForParameterByName(callback, name, triggerRequest) {
        if (callback === undefined || typeof callback != "function") {
            throw ("Callback must be a defined function");
        }
        this.onparameterListeners.push({
            name: name,
            callback: callback
        });
        if (triggerRequest !== false) {
            postMessage({
                message: "requestParameters",
                name: name
            });
        }
        return this.onparameterListeners.length;
    }
    listenForParameters(callback, triggerRequest) {
        if (callback === undefined || typeof callback != "function") {
            throw ("Callback must be a defined function");
        }
        this.onlisteners.push(callback);
        if (triggerRequest !== false) {
            postMessage({
                message: "requestParameters"
            });
        }
        return this.onlisteners.length;
    }
    listenForState(callback, level, term, triggerRequest) {
        if (callback === undefined || typeof callback != "function") {
            throw ("Callback must be a defined function");
        }
        if (level != "session" && level != "track" && level != "user" && level != "plugin") {
            throw "Invalid state level given: " + String(level);
        }
        this.statelisteners.push({
            level: level,
            term: term,
            callback: callback
        });
        if (triggerRequest !== false) {
            this.requestState(level, term);
        }
        return this.statelisteners.length;
    }
    requestState(level, term) {
        const message = "request" + level.charAt(0).toUpperCase() + level.slice(1) + "State";
        if (typeof name == "string") {
            postMessage({
                message: message,
                term: term
            });
        }
        else {
            throw ("Name not set");
        }
    }
    sendCustomEvent(type, payload) {
        postMessage({
            message: "customMessage",
            detail: {
                type: type,
                payload: payload
            }
        });
    }
}


/***/ }),

/***/ "./src/ParameterListeners/EditorParameterManager.ts":
/*!**********************************************************!*\
  !*** ./src/ParameterListeners/EditorParameterManager.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NumberParameterListener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NumberParameterListener */ "./src/ParameterListeners/NumberParameterListener.ts");
/* harmony import */ var _ListParameterListener__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ListParameterListener */ "./src/ParameterListeners/ListParameterListener.ts");
/* harmony import */ var _StringParameterListener__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StringParameterListener */ "./src/ParameterListeners/StringParameterListener.ts");
/* harmony import */ var _SwitchParameterListener__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SwitchParameterListener */ "./src/ParameterListeners/SwitchParameterListener.ts");
/*jshint esversion: 6 */




class EditorParameterManager {
    constructor(channel) {
        this.channel = channel;
        this.parameters = [];
    }
    createNumberParameterListener(parameterName, visibleName, defaultValue, maximum, minimum) {
        const node = new _NumberParameterListener__WEBPACK_IMPORTED_MODULE_0__["default"](this, this.channel, parameterName, visibleName, defaultValue, maximum, minimum);
        this.parameters.push(node);
        return node;
    }
    createListParameterListener(parameterName, visibleName, defaultValue, listValues) {
        const node = new _ListParameterListener__WEBPACK_IMPORTED_MODULE_1__["default"](this, this.channel, parameterName, visibleName, defaultValue, listValues);
        this.parameters.push(node);
        return node;
    }
    createStringParameterListener(parameterName, visibleName, defaultValue, maximumLength) {
        const node = new _StringParameterListener__WEBPACK_IMPORTED_MODULE_2__["default"](this, this.channel, parameterName, visibleName, defaultValue, maximumLength);
        this.parameters.push(node);
        return node;
    }
    createSwitchParameterListener(parameterName, visibleName, defaultValue, maxState, minState) {
        var node = new _SwitchParameterListener__WEBPACK_IMPORTED_MODULE_3__["default"](this, this.channel, parameterName, visibleName, defaultValue, maxState, minState);
        this.parameters.push(node);
        return node;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EditorParameterManager);


/***/ }),

/***/ "./src/ParameterListeners/IEditorParameterManager.ts":
/*!***********************************************************!*\
  !*** ./src/ParameterListeners/IEditorParameterManager.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/ParameterListeners/IParameterListener.ts":
/*!******************************************************!*\
  !*** ./src/ParameterListeners/IParameterListener.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/ParameterListeners/ListParameterListener.ts":
/*!*********************************************************!*\
  !*** ./src/ParameterListeners/ListParameterListener.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*jshint esversion: 6 */
class ListParameterListener {
    constructor(owner, channel, parameterName, visibleName, defaultValue, listValues) {
        this.owner = owner;
        this.channel = channel;
        this.parameterName = parameterName;
        this.visibleName = visibleName;
        this.defaultValue = defaultValue;
        this.listValues = listValues;
        this._value = this.defaultValue;
        this.channel.listenForParameterByName((e) => {
            if (this.listValues.includes(e.value)) {
                this._value = e.value;
            }
        }, parameterName, true);
    }
    update(value) {
        this.channel.setParameterByName(this.parameterName, value);
    }
    get value() { return this._value; }
    set value(v) {
        if (this.listValues.includes(v)) {
            this._value = v;
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ListParameterListener);


/***/ }),

/***/ "./src/ParameterListeners/NumberParameterListener.ts":
/*!***********************************************************!*\
  !*** ./src/ParameterListeners/NumberParameterListener.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*jshint esversion: 6 */
class NumberParameterListener {
    constructor(owner, channel, parameterName, visibleName, defaultValue, maximum, minimum) {
        this.owner = owner;
        this.channel = channel;
        this.parameterName = parameterName;
        this.visibleName = visibleName;
        this.defaultValue = defaultValue;
        this.maximum = maximum;
        this.minimum = minimum;
        this._value = this.defaultValue;
        this.channel.listenForParameterByName((e) => {
            if (typeof e.value === 'number') {
                this.value = e.value;
            }
        }, parameterName, true);
    }
    update(value) {
        this.channel.setParameterByName(this.parameterName, value);
    }
    get value() { return this._value; }
    set value(v) {
        if (typeof v === "number") {
            this._value = Math.max(this.minimum, Math.min(this.maximum, v));
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NumberParameterListener);


/***/ }),

/***/ "./src/ParameterListeners/StringParameterListener.ts":
/*!***********************************************************!*\
  !*** ./src/ParameterListeners/StringParameterListener.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*jshint esversion: 6 */
class StringParameterListener {
    constructor(owner, channel, parameterName, visibleName, defaultValue, maximumLength) {
        this.owner = owner;
        this.channel = channel;
        this.parameterName = parameterName;
        this.visibleName = visibleName;
        this.defaultValue = defaultValue;
        this.maximumLength = maximumLength;
        this._value = this.defaultValue;
        this.channel.listenForParameterByName((e) => {
            this.value = e.value;
        }, parameterName, true);
    }
    update(value) {
        this.channel.setParameterByName(this.parameterName, value);
    }
    get value() { return this._value; }
    set value(v) {
        if (typeof v === "string") {
            this._value = v;
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringParameterListener);


/***/ }),

/***/ "./src/ParameterListeners/SwitchParameterListener.ts":
/*!***********************************************************!*\
  !*** ./src/ParameterListeners/SwitchParameterListener.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*jshint esversion: 6 */
class SwitchParameterListener {
    constructor(owner, channel, parameterName, visibleName, defaultValue, minState, maxState) {
        this.owner = owner;
        this.channel = channel;
        this.parameterName = parameterName;
        this.visibleName = visibleName;
        this.defaultValue = defaultValue;
        this.minState = minState;
        this.maxState = maxState;
        this._value = this.defaultValue;
        this.channel.listenForParameterByName((e) => {
            this.value = e.value;
        }, parameterName, true);
    }
    update(value) {
        this.channel.setParameterByName(this.parameterName, value);
    }
    increment() {
        let v = this.value + 1;
        if (v > this.maxState) {
            v = this.minState;
        }
        this.value = v;
        return this.value;
    }
    decrement() {
        var v = this.value - 1;
        if (v < this.minState) {
            v = this.maxState;
        }
        this.value = v;
        return this.value;
    }
    get value() { return this._value; }
    set value(v) {
        if (typeof v === "number") {
            this.value = Math.max(this.minState, Math.min(this.maxState, v));
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SwitchParameterListener);


/***/ }),

/***/ "./src/ParameterListeners/index.ts":
/*!*****************************************!*\
  !*** ./src/ParameterListeners/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EditorParameterManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EditorParameterManager */ "./src/ParameterListeners/EditorParameterManager.ts");
/* harmony import */ var _IEditorParameterManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IEditorParameterManager */ "./src/ParameterListeners/IEditorParameterManager.ts");
/* harmony import */ var _IParameterListener__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IParameterListener */ "./src/ParameterListeners/IParameterListener.ts");
/* harmony import */ var _ListParameterListener__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ListParameterListener */ "./src/ParameterListeners/ListParameterListener.ts");
/* harmony import */ var _NumberParameterListener__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NumberParameterListener */ "./src/ParameterListeners/NumberParameterListener.ts");
/* harmony import */ var _StringParameterListener__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./StringParameterListener */ "./src/ParameterListeners/StringParameterListener.ts");
/* harmony import */ var _SwitchParameterListener__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SwitchParameterListener */ "./src/ParameterListeners/SwitchParameterListener.ts");









/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BasePluginEditorChannel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BasePluginEditorChannel */ "./src/BasePluginEditorChannel.ts");
/* harmony import */ var _ParameterListeners__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ParameterListeners */ "./src/ParameterListeners/index.ts");



})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map