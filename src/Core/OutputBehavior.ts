import { Behavior } from './Behavior';
import { Transform } from './BasicMathStructures';
import { GameObject } from './GameObject';
import { LogicBehavior } from './LogicBehavior';

export abstract class OutputBehavior extends Behavior {
    private _gameObject!: GameObject;

    override setup(attachedOn: GameObject) {
        super.setup(attachedOn);
        this._gameObject = attachedOn;
    }

    /**
     * Observe a LogicBehavior and call the observer function when the data changes.
     * @param BehaviorClass The specific LogicBehavior class type to observe.
     * @param observer The function to call when the data changes.
     * @protected
     */
    protected observe<T extends LogicBehavior<U>, U>(BehaviorClass: new (...args: any[]) => T, observer: (data : U) => void): void {
        let behavior = this._gameObject!.getFirstBehavior(BehaviorClass) as T | null;
        if (!behavior) {
            throw new Error("Logic Behavior not found.");
        }
        behavior.onDataChanged.addObserver(observer);
    }

    protected get transform(): Transform | null {
        return null;
    }
}
