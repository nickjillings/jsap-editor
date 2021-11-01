import { IBasePluginEditorChannel } from "../IBasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";
export declare class ListParameterListener<T> implements IParameterListener<T> {
    readonly owner: IEditorParameterManager;
    readonly channel: IBasePluginEditorChannel;
    readonly parameterName: string;
    readonly visibleName: string;
    readonly defaultValue: T;
    readonly listValues: T[];
    private _value;
    constructor(owner: IEditorParameterManager, channel: IBasePluginEditorChannel, parameterName: string, visibleName: string, defaultValue: T, listValues: T[]);
    update(value: T): void;
    get value(): T;
    set value(v: T);
}
