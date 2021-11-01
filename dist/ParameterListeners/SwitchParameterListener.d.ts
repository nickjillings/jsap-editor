import { IBasePluginEditorChannel } from "../IBasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";
export declare class SwitchParameterListener implements IParameterListener<number> {
    readonly owner: IEditorParameterManager;
    readonly channel: IBasePluginEditorChannel;
    readonly parameterName: string;
    readonly visibleName: string;
    readonly defaultValue: number;
    readonly minState: number;
    readonly maxState: number;
    private _value;
    constructor(owner: IEditorParameterManager, channel: IBasePluginEditorChannel, parameterName: string, visibleName: string, defaultValue: number, minState: number, maxState: number);
    update(value: number): void;
    increment(): number;
    decrement(): number;
    get value(): number;
    set value(v: number);
}
