/*jshint esversion: 6 */

import { lastValueFrom } from "rxjs";
import { IBasePluginEditorChannel } from "../IBasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";

class NumberParameterListener implements IParameterListener<number> {
    private _value = this.defaultValue;
    constructor (
        public readonly owner: IEditorParameterManager,
        public readonly channel: IBasePluginEditorChannel,
        public readonly parameterName: string,
        public readonly visibleName: string,
        public readonly defaultValue: number,
        public readonly maximum: number,
        public readonly minimum: number
    ) {
        this.channel.listenForParameterByName((e) => {
            if (typeof e.value === 'number') {
                this.value = e.value;
            }
        }, parameterName, true);
    }

    update(value: number) {
        this.channel.setParameterByName(this.parameterName, value);
    }

    get value () {return this._value;}

    set value(v: number) {
        if (typeof v === "number") {
            this._value = Math.max(this.minimum, Math.min(this.maximum, v));
        }
    }
}

export default NumberParameterListener;
