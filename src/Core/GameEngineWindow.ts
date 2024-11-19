import {GameEngineComponent} from "./GameEngineComponent.ts";
import {GameObject} from "./GameObject.ts";

/**
* @class GameEngineWindow
* @description Singleton class that represents the game engine window.
* @method get instance(): GameEngineWindow
* @method get root(): GameObject
* @method addGameComponent(component: GameEngineComponent): void
* @method getEngineComponent<T extends GameEngineComponent>(componentClass: new () => T): GameEngineComponent | null
* @property private static _instance: GameEngineWindow | null
* @property private engineComponents: GameEngineComponent[]
* @property private _root: GameObject
*/
export class GameEngineWindow {
    private static _INSTANCE: GameEngineWindow | null = null;
    private engineComponents: GameEngineComponent[] = [];
    private _root: GameObject = new GameObject();

    /**
     * @description Singleton instance of the GameEngineWindow class.
     * @returns {GameEngineWindow}
     */
    public static get instance(): GameEngineWindow {
        if (this._INSTANCE === null) {
            this._INSTANCE = new GameEngineWindow();
        }
        return this._INSTANCE;
    }

    /**
     * @description Root GameObject of the game engine window.
     * @returns {GameObject}
     */
    public get root(): GameObject {
        return this._root;
    }

    /**
     * @param component
     * @description Adds a GameEngineComponent to the game engine window unless it is already attached.
     */
    public addGameComponent(component: GameEngineComponent): void {
        if (this.engineComponents.includes(component)) return;
        this.engineComponents.push(component);
        component.onAttachedTo(this);
    }

    /**
     * @param componentClass
     * @description Returns a GameEngineComponent of the specified type.
     * @returns {GameEngineComponent | null}
     */
    public getEngineComponent<T extends GameEngineComponent>(componentClass: new () => T): GameEngineComponent | null {
        return this.engineComponents.find(component => component instanceof componentClass) || null;
    }
}
