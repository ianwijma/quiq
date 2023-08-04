import {WindowInstanceInformation} from "./spawn-window";

export class SearchWindow implements WindowInstanceInformation {
    readonly uniqueName: string = 'search';
    readonly allowMultiple: boolean = false;
    readonly path: string = 'search';
    readonly defaultWidth: number = 1280;
    readonly defaultHeight: number = 256;
    readonly openOnSpawn: boolean = true
}
