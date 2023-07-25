import {WindowInstanceInformation} from "./spawn-window";

export class SettingsWindow implements WindowInstanceInformation {
    readonly uniqueName: string = 'settings';
    readonly allowMultiple: boolean = false;
    readonly path: string = 'settings/keybinds';
    readonly defaultWidth: number = 1280;
    readonly defaultHeight: number = 720;
    readonly openOnSpawn: boolean = true
}
