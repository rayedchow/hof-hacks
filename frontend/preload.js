// Preload script to safely expose Node.js APIs to the renderer process
window.addEventListener('DOMContentLoaded', () => {
  // You can expose APIs from Node.js to your web app here if needed using contextBridge
  // For example:
  // import { contextBridge, ipcRenderer } from 'electron';
  // 
  // contextBridge.exposeInMainWorld('api', {
  //   send: (channel, data) => ipcRenderer.send(channel, data),
  //   receive: (channel, func) => {
  //     ipcRenderer.on(channel, (event, ...args) => func(...args))
  //   }
  // });
});
