import { IParameterListener } from "./IParameterListener";
export interface IEditorParameterManager {
    createNumberParameterListener(parameterName: string, visibleName: string, defaultValue: number, maximum: number, minimum: number): IParameterListener<number>;
    createListParameterListener<T>(parameterName: string, visibleName: string, defaultValue: T, listValues: T[]): IParameterListener<T>;
    createStringParameterListener(parameterName: string, visibleName: string, defaultValue: string): IParameterListener<string>;
    createSwitchParameterListener(parameterName: string, visibleName: string, defaultValue: number, maxState: number, minState: number): IParameterListener<number>;
    parameters: IParameterListener<any>[];
}
