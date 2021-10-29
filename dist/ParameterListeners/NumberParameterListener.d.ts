import { IBasePluginEditorChannel } from "../IBasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";
declare class NumberParameterListener implements IParameterListener<number> {
    readonly owner: IEditorParameterManager;
    readonly channel: IBasePluginEditorChannel;
    readonly parameterName: string;
    readonly visibleName: string;
    readonly defaultValue: number;
    readonly maximum: number;
    readonly minimum: number;
    private _value;
    constructor(owner: IEditorParameterManager, channel: IBasePluginEditorChannel, parameterName: string, visibleName: string, defaultValue: number, maximum: number, minimum: number);
    update(value: number): void;
    get value(): number;
    set value(v: number);
}
export default NumberParameterListener;
