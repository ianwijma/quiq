import {ApplicationKeybindInformation} from "../application-keybinds";
import spawnWindow from "../../windows/spawn-window";
import {SearchWindow} from "../../windows/search-window";

export class OpenSearch implements ApplicationKeybindInformation {
    readonly key: string = 'open-search';
    readonly name: string = 'Open Search';
    readonly description: string = 'Opens the search window';
    readonly defaultKeybind: string = 'CommandOrControl+space';
    keybind: string = '';

    action(): void {
        spawnWindow(new SearchWindow())
    }

}
