import { IBasePluginEditorChannel } from "../IBasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";
export declare class StringParameterListener implements IParameterListener<string> {
    readonly owner: IEditorParameterManager;
    readonly channel: IBasePluginEditorChannel;
    readonly parameterName: string;
    readonly visibleName: string;
    readonly defaultValue: string;
    readonly maximumLength: number;
    private _value;
    constructor(owner: IEditorParameterManager, channel: IBasePluginEditorChannel, parameterName: string, visibleName: string, defaultValue: string, maximumLength: number);
    update(value: string): void;
    get value(): string;
    set value(v: string);
}
