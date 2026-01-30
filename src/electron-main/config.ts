// Simplified Electron main process configuration

export interface AppConfig {
  mainWindow: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
  };
}

export const appConfig: AppConfig = {
  mainWindow: {
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
  },
};
