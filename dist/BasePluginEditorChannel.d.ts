import { EditorParameterManager } from "./ParameterListeners/EditorParameterManager";
import { IBasePluginEditorChannel, IBasePluginEditorChannelCallback, IParametersListenerCallback } from "./IBasePluginEditorChannel";
import { IBasePlugin, StateLevel } from "jsap";
declare global {
    interface Window {
        pluginInstance: IBasePlugin;
    }
}
export * from './IBasePluginEditorChannel';
export declare class BasePluginEditorChannel implements IBasePluginEditorChannel {
    private hostWindow;
    private unique_id;
    private onparameterListeners;
    private onlisteners;
    private statelisteners;
    readonly parameterListenerManager: EditorParameterManager;
    constructor();
    private postMessage;
    get pluginInstance(): IBasePlugin;
    setParameterByName(name: string, value: any): void;
    setParametersByObject(object: {
        name: string;
        value: any;
    }[]): void;
    requestParameters(): void;
    requestParameterByName(name: string): void;
    listenForParameterByName(callback: IBasePluginEditorChannelCallback, name: string, triggerRequest: boolean): number;
    listenForParameters(callback: IParametersListenerCallback, triggerRequest: boolean): number;
    listenForState(callback: (obj: any) => void, level: StateLevel, term: string, triggerRequest: boolean): number;
    requestState(level: StateLevel, term: string): void;
    sendCustomEvent(type: any, payload: any): void;
}
