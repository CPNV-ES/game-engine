import {GameEngineComponent} from "./GameEngineComponent.ts";
import {GameObject} from "./GameObject.ts";

/**
* @class GameEngineWindow
* @description Singleton class that represents the game engine window.
* @property {GameEngineComponent[]} _engineComponents - Array of GameEngineComponents that are attached to the game engine window.
*/
export class GameEngineWindow {
    private static _instance: GameEngineWindow | null = null;
    private _engineComponents: GameEngineComponent[] = [];
    private _root: GameObject = new GameObject();

    /**
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
     * @description Root GameObject of the game engine window, it will serve to be like a singleton that will contain all the other GameObjects.
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
        if (this._engineComponents.includes(component)) return;
        this._engineComponents.push(component);
        component.onAttachedTo(this);
    }

    /**
     * @param componentClass
     * @description Returns a GameEngineComponent of the specified type.
     * @returns {GameEngineComponent | null}
     */
    public getEngineComponent<T extends GameEngineComponent>(componentClass: new () => T): GameEngineComponent | null {
        return this._engineComponents.find(component => component instanceof componentClass) || null;
    }
}
