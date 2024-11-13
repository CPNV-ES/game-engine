import {GameEngineComponent} from "./GameEngineComponent.ts";

/**
 * @description Mock GameObject class for the GameEngineWindow class before it is implemented.
 */
export class GameObject {
    // Mock implementation
}

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
    private static _instance: GameEngineWindow | null = null;
    private engineComponents: GameEngineComponent[] = [];
    private _root: GameObject = new GameObject();

    /**
     * @method instance
     * @description Singleton instance of the GameEngineWindow class.
     * @returns {GameEngineWindow}
     */
    public static get instance(): GameEngineWindow {
        if (this._instance === null) {
            this._instance = new GameEngineWindow();
        }
        return this._instance;
    }

    /**
     * @method root
     * @description Root GameObject of the game engine window.
     * @returns {GameObject}
     */
    public get root(): GameObject {
        return this._root;
    }

    /**
     * @method addGameComponent
     * @param component
     * @description Adds a GameEngineComponent to the game engine window.
     */
    public addGameComponent(component: GameEngineComponent): void {
        this.engineComponents.push(component);
        component.onAttachedTo(this);
    }

    /**
     * @method getEngineComponent
     * @param componentClass
     * @description Returns a GameEngineComponent of the specified type.
     * @returns {GameEngineComponent | null}
     */
    public getEngineComponent<T extends GameEngineComponent>(componentClass: new () => T): GameEngineComponent | null {
        return this.engineComponents.find(component => component instanceof componentClass) || null;
    }
}
