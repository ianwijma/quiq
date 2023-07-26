import {app, ipcMain} from 'electron';
import serve from 'electron-serve';
import spawnWindow from "./windows/spawn-window";
import ApplicationKeybinds from "./application-keybinds/application-keybinds";
import {FlowWindow} from "./windows/flow-window";
import {isProd} from "./constants/isProd";
import {FlowManager} from "./flow/flow-manager";

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

  const flowManager = new FlowManager();
  await flowManager.loadFlows();

  // applicationKeybinds = new ApplicationKeybinds();
  // applicationKeybinds.reset();
  // applicationKeybinds.registerKeybind(new OpenSearch());
  // applicationKeybinds.load();

  ipcMain.handle('list-flows', () => {
    return flowManager.listFlows();
  });

  ipcMain.handle('get-flow', (event, args) => {
    const {id} = args;
    const flowMap = flowManager.mapFlows();
    return flowMap[id];
  });

  ipcMain.handle('create-flow', (event, args) => {
    const {name} = args;
    return flowManager.createFlow(name);
  });

  ipcMain.handle('update-flow', (event, args) => {
    const {flow} = args;
    return flowManager.updateFlow(flow);
  });
})();

app.on('before-quit', () => {
  if (applicationKeybinds) {
    applicationKeybinds.save();
  }
})
