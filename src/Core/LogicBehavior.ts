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
    protected data!: T;

    override setup(attachedOn: GameObject) {
        super.setup(attachedOn);
        this.gameObject = attachedOn;
    }

    protected notifyDataChanged(): void {
        this.onDataChanged.emit(this.data);
    }
}
