import {app} from 'electron';
import serve from 'electron-serve';
import spawnWindow from "./windows/spawn-window";
import ApplicationKeybinds from "./application-keybinds/application-keybinds";
import {OpenSearch} from "./application-keybinds/keybinds/open-search";
import {FlowWindow} from "./windows/flow-window";
import {isProd} from "./constants/isProd";

let applicationKeybinds: ApplicationKeybinds;

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  if (!isProd) {
    // During development, you probably want to spawn the window you're working on.
    spawnWindow(new FlowWindow());
  }

  applicationKeybinds = new ApplicationKeybinds();
  applicationKeybinds.reset();
  applicationKeybinds.registerKeybind(new OpenSearch());
  applicationKeybinds.load();
})();

app.on('before-quit', () => {
  if (applicationKeybinds) {
    applicationKeybinds.save();
  }
})
