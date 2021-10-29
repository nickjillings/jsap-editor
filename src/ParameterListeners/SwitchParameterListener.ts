/*jshint esversion: 6 */

import { IBasePluginEditorChannel } from "../IBasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";

class SwitchParameterListener implements IParameterListener<number> {
    private _value = this.defaultValue;
    constructor (
        public readonly owner: IEditorParameterManager,
        public readonly channel: IBasePluginEditorChannel,
        public readonly parameterName: string,
        public readonly visibleName: string,
        public readonly defaultValue: number,
        public readonly minState: number,
        public readonly maxState: number
    ) {
        this.channel.listenForParameterByName((e) => {
            this.value = e.value;
        }, parameterName, true);
    }

    update(value: number) {
        this.channel.setParameterByName(this.parameterName, value);
    }

    increment() {
        let v = this.value + 1;
        if (v > this.maxState) {
            v = this.minState;
        }
        this.value = v;
        return this.value;
    }

    decrement() {
        var v = this.value - 1;
        if (v < this.minState) {
            v = this.maxState;
        }
        this.value = v;
        return this.value;
    }

    get value () {return this._value;}

    set value(v: number) {
        if (typeof v === "number") {
            this.value = Math.max(this.minState, Math.min(this.maxState, v));
        }
    }
}

export default SwitchParameterListener;
