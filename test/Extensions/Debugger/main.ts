import { GameEngineWindow } from "@core/GameEngineWindow.ts";
import { GameObject } from "@core/GameObject.ts";
import { TestBehavior } from "@test/Core/Mocks/TestBehavior.ts";
import { TestInputBehavior } from "@test/Core/Mocks/TestInputBehavior.ts";
import { TestLogicBehavior } from "@test/Core/Mocks/TestLogicBehavior.ts";

const gameEngineWindow: GameEngineWindow = GameEngineWindow.instance;

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
