// jshint esversion: 6

/*
    JSAP Plugin GUI Channel object

    This object helps to abstract the various communication platforms in JSAP
    between the plugin processor (BasePlugin) and the GUI on top.
*/

import EditorParameterManager from "./ParameterListeners/EditorParameterManager";
import { IBasePluginEditorChannel, IParameterListenerHandler, IBasePluginEditorChannelCallback, IParametersListenerCallback, IStateListenerHandler } from "./IBasePluginEditorChannel";
import { PluginParameterUpdateMessage, PluginStateUpdateMessage, IBasePlugin, StateLevel } from "jsap";

declare global {
    interface Window {
        pluginInstance: IBasePlugin;
    }
}
  

export default class BasePluginEditorChannel implements IBasePluginEditorChannel {
    private hostWindow: Window
    private unique_id = (function (len) {
        function dec2hex (dec) {
            return ('0' + dec.toString(16)).substr(-2);
        }
        var arr = new Uint8Array((len || 40) / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, dec2hex).join('');
    })(32);
    private onparameterListeners: IParameterListenerHandler[] = [];
    private onlisteners: IParametersListenerCallback[] = [];
    private statelisteners: IStateListenerHandler[] = [];
    public readonly parameterListenerManager = new EditorParameterManager(this);
    constructor() {
        if (window.opener) {
            // We are a popout window
            this.hostWindow = window.opener;
        } else if (window.parent) {
            this.hostWindow = window.parent;
        }
        window.onmessage = function(e) {
            if (e.source != this.hostWindow) {
                return;
            }
            if (e.data.sender_id == this.unique_id) {
                return;
            }
            let customEvent;
            switch(e.data.message) {
                case "updateParameters":
                    customEvent = new CustomEvent<PluginParameterUpdateMessage>("parametersChanged", {detail: e.data});
                    break;
                case "updateState":
                    customEvent = new CustomEvent<PluginStateUpdateMessage>("updateState", {detail: e.data});
                    break;
                default:
                    return;
            }
            window.dispatchEvent(customEvent);
        };

        window.addEventListener("parametersChanged", (e: CustomEvent<PluginParameterUpdateMessage>) => {
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
    
        window.addEventListener("updateState", (e: CustomEvent<PluginStateUpdateMessage>) => {
            this.statelisteners.filter((listener) => {
                return (listener.level == e.detail.level) && (listener.term == e.detail.term);
            }).forEach(function(listener) {
                listener.callback(e.detail.value);
            });
        });
    }
    private postMessage(object) {
        if (object === undefined || object.message === undefined) {
            throw("Malformed message object");
        }
        object.sender_id = this.unique_id;
        this.hostWindow.postMessage(object, window.location.origin);
    }

    get pluginInstance() {return window.pluginInstance as IBasePlugin}

    public setParameterByName(name: string, value: any) {
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

    public setParametersByObject(object: {name: string, value: any}[]) {
        postMessage({
            message: "setParametersByObject",
            parameters: object
        });
    }

    public requestParameters() {
        postMessage({
            message: "requestParameters"
        });
    }

    public requestParameterByName(name:string) {
        if (typeof name == "string") {
            postMessage({
                message: "requestParameters",
                name: name
            });
        } else {
            throw("Name not set");
        }
    }

    public listenForParameterByName(callback: IBasePluginEditorChannelCallback, name: string, triggerRequest: boolean) {
        if (callback === undefined || typeof callback != "function") {
            throw("Callback must be a defined function");
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

    public listenForParameters(callback: IParametersListenerCallback, triggerRequest: boolean) {
        if (callback === undefined || typeof callback != "function") {
            throw("Callback must be a defined function");
        }
        this.onlisteners.push(callback);
        if (triggerRequest !== false) {
            postMessage({
                message: "requestParameters"
            });
        }
        return this.onlisteners.length;
    }

    public listenForState(callback: (obj: any) => void, level:StateLevel, term: string, triggerRequest: boolean) {
        if (callback === undefined || typeof callback != "function") {
            throw("Callback must be a defined function");
        }
        if (level != "session" && level != "track" && level != "user" && level != "plugin") {
            throw "Invalid state level given: "+String(level);
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

    public requestState(level: StateLevel, term: string) {
        const message = "request" + level.charAt(0).toUpperCase() + level.slice(1) + "State";
        if (typeof name == "string") {
            postMessage({
                message: message,
                term: term
            });
        } else {
            throw("Name not set");
        }
    }

    public sendCustomEvent(type, payload) {
        postMessage({
            message: "customMessage",
            detail: {
                type: type,
                payload: payload
            }
        });
    }
}
