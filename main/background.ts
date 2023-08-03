import {app, ipcMain} from 'electron';
import serve from 'electron-serve';
import spawnWindow from "./windows/spawn-window";
import ApplicationKeybinds from "./application-keybinds/application-keybinds";
import {FlowWindow} from "./windows/flow-window";
import {isProd} from "./constants/isProd";
import {FlowManager} from "./flow/flow-manager";
import FlowStore from "./flowSystem/flow-store";
import Flow from "./flowSystem/flow";

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

  // applicationKeybinds = new ApplicationKeybinds();
  // applicationKeybinds.reset();
  // applicationKeybinds.registerKeybind(new OpenSearch());
  // applicationKeybinds.load();

  const flowStore = new FlowStore();
  flowStore.load();

  ipcMain.handle('list-flows', (): Flow[] => {
    return flowStore.list();
  });

  ipcMain.handle('get-flow', (event, args): Flow => {
    const {id} = args;
    return flowStore.get(id);
  });

  ipcMain.handle('create-flow', (event, args): Flow => {
    const {name} = args;
    return flowStore.create(name);
  });

  ipcMain.handle('update-flow', (event, args): Flow => {
    let { flow } = args;
    if (!(flow instanceof Flow)) flow = Flow.fromSerialize(flow)
    return flowStore.update(flow);
  });
})();

app.on('before-quit', () => {
  if (applicationKeybinds) {
    applicationKeybinds.save();
  }
})
