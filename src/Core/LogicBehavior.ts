import { Behavior } from './Behavior';
import { GameObject } from './GameObject';

class Event<T> {
    emit(data: T): void {
    }
    addObserver(observer: (data: T) => void): void {

    }
}

/**
 * A behavior that contains logic to modify an owned data state object.
 */
export class LogicBehavior<T> extends Behavior {
    public readonly onDataChanged = new Event<T>();

    protected gameObject!: GameObject;

    private _data!: T;

    override setup(attachedOn: GameObject) {
        super.setup(attachedOn);
        this.gameObject = attachedOn;
    }

    public get data(): T {
        return this._data;
    }

    protected setDataAndNotify(data: T): void {
        this.setDataQuietly(data);
        this.onDataChanged.emit(data);
    }

    protected setDataQuietly(data: T): void {
        this._data = data;
    }
}
