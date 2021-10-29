import { IEditorParameterManager } from "./ParameterListeners/IEditorParameterManager";
import { IBasePlugin, PluginParameterJSON, PluginParameterJSONEntry, StateLevel } from "jsap";
export declare type IBasePluginEditorChannelCallback = (obj: PluginParameterJSONEntry) => void;
export interface IParameterListenerHandler {
    name: string;
    callback: IBasePluginEditorChannelCallback;
}
export interface IStateListenerHandler {
    level: StateLevel;
    term: string;
    callback: (obj: any) => void;
}
export declare type IParametersListenerCallback = (obj: PluginParameterJSON) => void;
export interface IBasePluginEditorChannel {
    readonly parameterListenerManager: IEditorParameterManager;
    readonly pluginInstance: IBasePlugin;
    setParameterByName(name: string, value: any): void;
    setParametersByObject(object: {
        name: string;
        value: any;
    }[]): void;
    requestParameters(): void;
    requestParameterByName(name: string): void;
    listenForParameterByName(callback: IBasePluginEditorChannelCallback, name: string, triggerRequest: boolean): void;
    listenForParameters(callback: IParametersListenerCallback, triggerRequest: boolean): void;
    listenForState(callback: (obj: any) => void, level: StateLevel, term: string, triggerRequest: boolean): void;
    requestState(level: StateLevel, term: string): void;
    sendCustomEvent(type: any, payload: any): void;
}
