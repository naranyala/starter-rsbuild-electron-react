declare module 'winbox/src/js/winbox' {
  interface WinBoxParams {
    title: string;
    html: string;
    width?: string;
    height?: string;
    x?: string | number;
    y?: string | number;
    class?: string;
    background?: string;
    border?: number;
  }

  class WinBox {
    constructor(params: WinBoxParams);
    body: HTMLElement;
  }

  export default WinBox;
}
