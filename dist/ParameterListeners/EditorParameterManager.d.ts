import { NumberParameterListener } from "./NumberParameterListener";
import { StringParameterListener } from "./StringParameterListener";
import { SwitchParameterListener } from "./SwitchParameterListener";
import { BasePluginEditorChannel } from "../BasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";
export declare class EditorParameterManager implements IEditorParameterManager {
    readonly channel: BasePluginEditorChannel;
    parameters: IParameterListener<any>[];
    constructor(channel: BasePluginEditorChannel);
    createNumberParameterListener(parameterName: string, visibleName: string, defaultValue: number, maximum: number, minimum: number): NumberParameterListener;
    createListParameterListener<T>(parameterName: string, visibleName: string, defaultValue: T, listValues: T[]): any;
    createStringParameterListener(parameterName: string, visibleName: string, defaultValue: string, maximumLength?: number): StringParameterListener;
    createSwitchParameterListener(parameterName: string, visibleName: string, defaultValue: number, maxState: number, minState: number): SwitchParameterListener;
}
