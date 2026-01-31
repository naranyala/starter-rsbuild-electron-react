declare module 'winbox/src/js/winbox' {
  interface WinBoxParams {
    title: string;
    html: string;
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
    // biome-ignore lint/suspicious/noExplicitAny: Allow additional WinBox options
    [key: string]: any;
  }

  class WinBox {
    constructor(params: WinBoxParams);
    body: HTMLElement;
    close: () => void;
  }

  export default WinBox;
}
