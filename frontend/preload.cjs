// Preload script to safely expose Node.js APIs to the renderer process
const { contextBridge, ipcRenderer } = require('electron');

// When document is loaded
window.addEventListener('DOMContentLoaded', () => {
  // You can expose APIs from Node.js to your web app here if needed
  // Example of safely exposing node capabilities via the context bridge
  /*
  contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
      // Whitelist channels to ensure security
      const validChannels = ['some-event', 'another-event'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      const validChannels = ['some-response', 'another-response'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  });
  */
});
