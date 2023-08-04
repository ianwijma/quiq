import {screen, BrowserWindow, BrowserWindowConstructorOptions} from "electron";
import Store from "electron-store";

export interface WindowInstanceInformation {
    readonly uniqueName: string
    readonly allowMultiple: boolean
    readonly path: string
    readonly defaultWidth: number
    readonly defaultHeight: number
    readonly openOnSpawn: boolean
}

export default (windowInstanceInformation: WindowInstanceInformation): BrowserWindow => {
    const {uniqueName, path, allowMultiple, defaultHeight, defaultWidth, openOnSpawn} = windowInstanceInformation;

    const key = 'window-state'
    const name = `${key}-${uniqueName}`;

    const store = new Store({ name });
    let state = {};

    const isProd: boolean = process.env.NODE_ENV === 'production';
    const defaultSize = {
        width: defaultWidth,
        height: defaultHeight,
    };

    const restore = () => store.get(key, defaultSize);

    const windowWithinBounds = (windowState, bounds) => {
        return (
            windowState.x >= bounds.x &&
            windowState.y >= bounds.y &&
            windowState.x + windowState.width <= bounds.x + bounds.width &&
            windowState.y + windowState.height <= bounds.y + bounds.height
        );
    };

    const resetToDefaults = () => {
        const bounds = screen.getPrimaryDisplay().bounds;
        return Object.assign({}, defaultSize, {
            x: (bounds.width - defaultSize.width) / 2,
            y: (bounds.height - defaultSize.height) / 2,
        });
    };

    const ensureVisibleOnSomeDisplay = windowState => {
        const visible = screen.getAllDisplays().some(display => {
            return windowWithinBounds(windowState, display.bounds);
        });

        if (!visible) {
            // Window is partially or fully not visible now.
            // Reset it to safe defaults.
            return resetToDefaults();
        }

        return windowState;
    };

    state = ensureVisibleOnSomeDisplay(restore());

    const windowOptions: BrowserWindowConstructorOptions = {
        ...state,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    }

    const window = new BrowserWindow(windowOptions);

    const getCurrentPosition = () => {
        const position = window.getPosition();
        const size = window.getSize();
        return {
            x: position[0],
            y: position[1],
            width: size[0],
            height: size[1],
        };
    };

    const saveState = () => {
        if (!window.isMinimized() && !window.isMaximized()) {
            Object.assign(state, getCurrentPosition());
        }
        store.set(key, state);
    };

    const openWindow = async () => {
        if (isProd) {
            await window.loadURL(`app://./${path}.html`);
        } else {
            const port = process.argv[2];
            await window.loadURL(`http://localhost:${port}/${path}`);
            window.webContents.openDevTools();
        }
    }

    window.on('close', saveState);

    if (openOnSpawn) {
        openWindow().catch(console.error);
    }

    return window;
}
