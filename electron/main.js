import { app, BrowserWindow, Menu, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400, height: 900, minWidth: 1024, minHeight: 700,
    title: "Chili3D",
    icon: path.join(__dirname, "../public/favicon.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, nodeIntegration: false, sandbox: false,
    },
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:8080");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

const menuTemplate = [
  { label: "File", submenu: [{ role: "reload" }, { role: "forceReload" }, { type: "separator" }, { role: "quit" }] },
  { label: "View", submenu: [{ role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" }, { type: "separator" }, { role: "togglefullscreen" }] },
  { label: "Help", submenu: [{ label: "Chili3D Website", click: () => shell.openExternal("https://chili3d.com") }, { label: "GitHub", click: () => shell.openExternal("https://github.com/xiangechen/chili3d") }] },
];

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
