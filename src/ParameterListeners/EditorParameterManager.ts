/*jshint esversion: 6 */
import {NumberParameterListener} from "./NumberParameterListener";
import {ListParameterListener} from "./ListParameterListener";
import {StringParameterListener} from "./StringParameterListener";
import {SwitchParameterListener} from "./SwitchParameterListener";
import { BasePluginEditorChannel } from "../BasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";

export class EditorParameterManager implements IEditorParameterManager {
    public parameters: IParameterListener<any>[] = [];
    constructor(public readonly channel: BasePluginEditorChannel) {

    }
    createNumberParameterListener(parameterName: string, visibleName: string, defaultValue: number, maximum: number, minimum: number) {
        const node = new NumberParameterListener(this, this.channel, parameterName, visibleName, defaultValue, maximum, minimum);
        this.parameters.push(node);
        return node;
    }
    createListParameterListener<T>(parameterName: string, visibleName: string, defaultValue: T, listValues: T[]) {
        const node = new ListParameterListener(this, this.channel, parameterName, visibleName, defaultValue, listValues);
        this.parameters.push(node);
        return node;
    }
    createStringParameterListener(parameterName: string, visibleName: string, defaultValue: string, maximumLength?: number) {
        const node = new StringParameterListener(this, this.channel, parameterName, visibleName, defaultValue, maximumLength);
        this.parameters.push(node);
        return node;
    }
    createSwitchParameterListener(parameterName: string, visibleName: string, defaultValue: number, maxState: number, minState: number) {
        var node = new SwitchParameterListener(this, this.channel, parameterName, visibleName, defaultValue, maxState, minState);
        this.parameters.push(node);
        return node;
    }

}
