import {LogicBehavior} from "../../../src/Core/LogicBehavior";
import {TestData} from "./TestData";

export class TestLogicBehavior extends LogicBehavior<TestData>{
    protected onEnable() {
        super.onEnable();
    }

    protected onDisable() {
        super.onDisable();
    }

    protected tick(deltaTime: number) {
        super.tick(deltaTime);
    }

    public callFromTestInputBehavior(){
        this.data.number = 1;
        this.data.string = "test";
        this.notifyDataChanged();
    }
}