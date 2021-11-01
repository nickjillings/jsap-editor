/*jshint esversion: 6 */

import { IBasePluginEditorChannel } from "../IBasePluginEditorChannel";
import { IEditorParameterManager } from "./IEditorParameterManager";
import { IParameterListener } from "./IParameterListener";

export class StringParameterListener implements IParameterListener<string>  {
    private _value = this.defaultValue;
    constructor (
        public readonly owner: IEditorParameterManager,
        public readonly channel: IBasePluginEditorChannel,
        public readonly parameterName: string,
        public readonly visibleName: string,
        public readonly defaultValue: string,
        public readonly maximumLength: number
    ) {
        this.channel.listenForParameterByName((e) => {
            this.value = e.value;
        }, parameterName, true);
    }

    update(value: string) {
        this.channel.setParameterByName(this.parameterName, value);
    }

    get value () {return this._value;}

    set value(v: string) {
        if (typeof v === "string") {
            this._value = v;
        }
    }
}
