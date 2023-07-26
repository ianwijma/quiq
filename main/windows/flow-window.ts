import {WindowInstanceInformation} from "./spawn-window";
import {isProd} from "../constants/isProd";

export class FlowWindow implements WindowInstanceInformation {
    readonly uniqueName: string = 'flow';
    readonly allowMultiple: boolean = false;
    readonly path: string = 'flow';
    readonly defaultWidth: number = 1280 + (isProd ? 0 : 512);
    readonly defaultHeight: number = 720;
    readonly openOnSpawn: boolean = true
}
