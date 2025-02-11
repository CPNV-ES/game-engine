import { GameObject } from "../../../src/Core/GameObject";
import { TestBehavior } from "../../Core/Mocks/TestBehavior";
import { TestInputBehavior } from "../../Core/Mocks/TestInputBehavior";
import { TestLogicBehavior } from "../../Core/Mocks/TestLogicBehavior";
import { Sprunk } from "../../../src/Core/Initialisation/Sprunk";
import { GameEngineWindow } from "../../../src/Core/GameEngineWindow";

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(null, true, []);

const childGameObject1: GameObject = new GameObject();
const childGameObject2: GameObject = new GameObject();
const grandChildGameObject: GameObject = new GameObject();

gameEngineWindow.root.name = "Root";
childGameObject1.name = "Child 1";
childGameObject2.name = "Child 2";
grandChildGameObject.name = "Grandchild";

gameEngineWindow.root.addChild(childGameObject1);
gameEngineWindow.root.addChild(childGameObject2);
childGameObject1.addChild(grandChildGameObject);

childGameObject1.addBehavior(new TestBehavior());
childGameObject1.addBehavior(new TestInputBehavior());
childGameObject1.addBehavior(new TestLogicBehavior());
