declare module 'wait-on' {
  interface WaitOnOptions {
    resources: string[];
    timeout?: number;
  }

  function waitOn(options: WaitOnOptions): Promise<void>;
  export = waitOn;
}
