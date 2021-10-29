/*jshint esversion: 6 */

import { IBasePlugin } from "../../../JSAP/dist";
import { IBasePluginEditorChannel } from "../IBasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";

class ListParameterListener<T> implements IParameterListener<T> {
    private _value = this.defaultValue;
    constructor(
        public readonly owner: IEditorParameterManager,
        public readonly channel: IBasePluginEditorChannel,
        public readonly parameterName:string,
        public readonly visibleName: string,
        public readonly defaultValue: T,
        public readonly listValues: T[]
    ) {
        this.channel.listenForParameterByName((e) => {
            if (this.listValues.includes(e.value)) {
                this._value = e.value;
            }
        }, parameterName, true);
    }
    update(value: T) {
        this.channel.setParameterByName(this.parameterName, value);
    }

    get value () {return this._value;}

    set value(v: T) {
        if (this.listValues.includes(v)) {
            this._value = v;
        }
    }
}

export default ListParameterListener;
