import { Behavior } from './Behavior';
import { GameObject } from './GameObject';
import {Event} from "./EventSystem/Event.ts";

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
