export class DraggableElement {
  private readonly _elementToDrag: HTMLElement;
  private _isDragging: boolean = false;
  private _offsetX: number = 0;
  private _offsetY: number = 0;

  constructor(elementToDrag: HTMLElement) {
    this._elementToDrag = elementToDrag;
    this._elementToDrag.style.position = "absolute"; // Ensure it's positioned properly for dragging
    this._elementToDrag.style.left = "0";
    this._elementToDrag.style.top = "0";

    // Attach event listeners to the element itself
    this._elementToDrag.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this),
    );
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.target !== this._elementToDrag) return;

    this._isDragging = true;
    this._offsetX = event.clientX - this._elementToDrag.offsetLeft;
    this._offsetY = event.clientY - this._elementToDrag.offsetTop;
    this._elementToDrag.style.cursor = "grabbing";
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this._isDragging) return;
    this._elementToDrag.style.left = `${event.clientX - this._offsetX}px`;
    this._elementToDrag.style.top = `${event.clientY - this._offsetY}px`;
  }

  private onMouseUp(): void {
    if (!this._isDragging) return;
    this._isDragging = false;
    this._elementToDrag.style.removeProperty("cursor");

    // Ensure the parent is positioned correctly
    const parent = this._elementToDrag.parentElement;
    if (!parent) return;

    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;
    const elementWidth = this._elementToDrag.offsetWidth;
    const elementHeight = this._elementToDrag.offsetHeight;

    // Parse the current position
    let left = parseFloat(this._elementToDrag.style.left) || 0;
    let top = parseFloat(this._elementToDrag.style.top) || 0;

    // Constrain the element within the parent bounds
    left = Math.max(0, Math.min(left, parentWidth - elementWidth));
    top = Math.max(0, Math.min(top, parentHeight - elementHeight));

    // Apply the corrected values
    this._elementToDrag.style.left = `${left}px`;
    this._elementToDrag.style.top = `${top}px`;
  }
}
