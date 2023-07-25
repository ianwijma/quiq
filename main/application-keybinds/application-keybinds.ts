import Store from "electron-store";
import { globalShortcut } from 'electron';

export interface ApplicationKeybindInformation {
    readonly key: string
    readonly name: string
    readonly description: string
    keybind: string
    readonly defaultKeybind: string

    action: () => void
}

export default class ApplicationKeybinds {
    private keybinds: ApplicationKeybindInformation[] = [];

    constructor(private store = new Store({ name: 'application-keybinds' })) {}

    registerKeybind(applicationKeybindInformation: ApplicationKeybindInformation) {
        this.keybinds.push(applicationKeybindInformation);
    }

    load() {
        this.keybinds.forEach(kbi => {
            kbi.keybind = this.store.get<Record<string, string>>(`application-keybind-${kbi.key}`, kbi.defaultKeybind);

            console.log(kbi.keybind);
            globalShortcut.register(kbi.keybind, kbi.action);
        })
    }

    unload() {
        globalShortcut.unregisterAll()
    }

    reset() {
        this.keybinds.forEach(kbi => {
            this.store.delete<Record<string, string>>(`application-keybind-${kbi.key}`);
        })
    }

    save() {
        this.keybinds.forEach(kbi => {
            this.store.set(`application-keybind-${kbi.key}`, kbi.keybind ?? kbi.defaultKeybind);
        })
    }

    list(): ApplicationKeybindInformation[] {
        return this.keybinds
    }
}
