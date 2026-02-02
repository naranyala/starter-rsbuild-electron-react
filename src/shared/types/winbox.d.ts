declare module 'winbox' {
  interface WinBoxParams {
    title: string;
    html?: string;
    width?: string | number;
    height?: string | number;
    minwidth?: string | number;
    minheight?: string | number;
    maxwidth?: string | number;
    maxheight?: string | number;
    x?: string | number;
    y?: string | number;
    class?: string;
    background?: string;
    border?: number;
    modal?: boolean;
    mount?: HTMLElement | undefined;
    onclose?: () => void;
    [key: string]: unknown;
  }

  class WinBox {
    constructor(params: WinBoxParams);
    body: HTMLElement;
    DOM: HTMLElement;
    close: () => void;
    minimize: () => void;
    maximize: () => void;
    restore: () => void;
    show: () => void;
  }

  export default WinBox;
}

declare module 'winbox/src/js/winbox' {
  export * from 'winbox';
  export default WinBox;
}
