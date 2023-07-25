import {app} from 'electron';
import serve from 'electron-serve';
import spawnWindow from "./windows/spawn-window";
import {SettingsWindow} from "./windows/settings-window";
import ApplicationKeybinds from "./application-keybinds/application-keybinds";
import {OpenSearch} from "./application-keybinds/keybinds/open-search";

const isProd: boolean = process.env.NODE_ENV === 'production';
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
    spawnWindow(new SettingsWindow());
  }

  applicationKeybinds = new ApplicationKeybinds();
  applicationKeybinds.registerKeybind(new OpenSearch())
  applicationKeybinds.load();
})();

app.on('before-quit', () => {
  if (applicationKeybinds) {
    applicationKeybinds.save();
  }
})
