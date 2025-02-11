export class ResizableElement {
  private readonly _elementToResize: HTMLElement;
  private _isResizing: boolean = false;
  private _startX: number = 0;
  private _startY: number = 0;
  private _startWidth: number = 0;
  private _startHeight: number = 0;
  private readonly _resizeHandle: HTMLElement;
  private readonly _minWidth: number = 50;
  private readonly _minHeight: number = 50;

  constructor(elementToResize: HTMLElement) {
    this._elementToResize = elementToResize;
    this._elementToResize.style.position = "absolute";

    // Create a resize handle
    this._resizeHandle = document.createElement("div");
    this._resizeHandle.style.width = "10px";
    this._resizeHandle.style.height = "10px";
    this._resizeHandle.style.position = "absolute";
    this._resizeHandle.style.right = "0";
    this._resizeHandle.style.bottom = "0";
    this._resizeHandle.style.cursor = "nwse-resize";
    this._resizeHandle.style.background = "rgba(0, 0, 0, 0.5)";
    this._resizeHandle.style.borderRadius = "50%";

    // Attach handle to element
    this._elementToResize.appendChild(this._resizeHandle);

    // Attach event listeners
    this._resizeHandle.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this),
    );
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this._isResizing = true;
    this._startX = event.clientX;
    this._startY = event.clientY;
    this._startWidth = this._elementToResize.offsetWidth;
    this._startHeight = this._elementToResize.offsetHeight;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this._isResizing) return;

    let newWidth = this._startWidth + (event.clientX - this._startX);
    let newHeight = this._startHeight + (event.clientY - this._startY);

    // Constrain to minimum size
    newWidth = Math.max(this._minWidth, newWidth);
    newHeight = Math.max(this._minHeight, newHeight);

    // Constrain to parent bounds
    const parent = this._elementToResize.parentElement;
    if (parent) {
      const maxWidth = parent.clientWidth - this._elementToResize.offsetLeft;
      const maxHeight = parent.clientHeight - this._elementToResize.offsetTop;
      newWidth = Math.min(newWidth, maxWidth);
      newHeight = Math.min(newHeight, maxHeight);
    }

    // Apply new size
    this._elementToResize.style.width = `${newWidth}px`;
    this._elementToResize.style.height = `${newHeight}px`;
  }

  private onMouseUp(): void {
    this._isResizing = false;
  }
}
