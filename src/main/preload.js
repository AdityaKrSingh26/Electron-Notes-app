const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    loadNotes: () => ipcRenderer.invoke("load-notes"),
    saveNote: (notes) => ipcRenderer.send("save-note", notes),
});
