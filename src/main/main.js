import fs from "fs";
import path from "path";
import {
    app,
    BrowserWindow,
    ipcMain
} from "electron";
import {
    fileURLToPath
} from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const notesFilePath = path.join(__dirname, "../storage/notes.json");

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
        },
    });

    win.loadFile(path.join(__dirname, "../renderer/index.html"));
}

// Ensure notes file exists
function noteFileExist() {
    if (!fs.existsSync(path.dirname(notesFilePath))) {
        fs.mkdirSync(path.dirname(notesFilePath), { recursive: true });
    }
    if (!fs.existsSync(notesFilePath)) {
        fs.writeFileSync(notesFilePath, JSON.stringify([]));
    }
}

// event to load notes
ipcMain.handle("load-notes", async () => {
    noteFileExist();
    const data = fs.readFileSync(notesFilePath, "utf8");
    return JSON.parse(data);
});

// event to save notes
ipcMain.on("save-note", (event, notes) => {
    noteFileExist();
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
});

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
