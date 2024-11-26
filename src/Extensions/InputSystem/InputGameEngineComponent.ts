import {GameEngineComponent} from "../../Core/GameEngineComponent.ts";
import {Device} from "./Device.ts";

class InputGameEngineComponent extends GameEngineComponent {
    private _devices: Device[] = [];

    public getDevice<T extends Device>(deviceClass: new () => T): Device | null {
        return (
            this._devices.find((device) => device instanceof deviceClass) || null
        );
    }

    public addDevice(device: Device): void {
        this._devices.push(device);
    }
}
