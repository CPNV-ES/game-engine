import { LogicBehavior } from "../../src/Core/LogicBehavior";
import { vec3, Vec3 } from "wgpu-matrix";
import { Vector2 } from "../../src/Core/MathStructures/Vector2";

export class FreeLookCameraController extends LogicBehavior<{
  position: Vec3;
  rotation: Vec3;
}> {
  private _movementSpeed: number;
  private _lookSensitivity: number;

  constructor(movementSpeed: number = 0.1, lookSensitivity: number = 0.002) {
    super();
    this.data = {
      position: vec3.create(0, 0, 3),
      rotation: vec3.create(0, 0, 0),
    };
    this._movementSpeed = movementSpeed;
    this._lookSensitivity = lookSensitivity;
  }

  public move(direction: Vec3): void {
    // Calculer la direction avant en utilisant pitch (rotation[0]) et yaw (rotation[1])
    const forward = vec3.normalize(
      vec3.create(
        -(Math.cos(this.data.rotation[0]) * Math.sin(this.data.rotation[1])),
        Math.sin(this.data.rotation[0]), // Inclut l'inclinaison
        Math.cos(this.data.rotation[0]) * Math.cos(this.data.rotation[1]),
      ),
    );

    // Calculer la direction latérale (droite)
    const right = vec3.normalize(vec3.cross(vec3.create(0, 1, 0), forward));
    // Appliquer les translations en fonction de l'entrée de l'utilisateur
    this.data.position = vec3.add(
      this.data.position,
      vec3.scale(forward, direction[2] * this._movementSpeed), // Avancer/Reculer
    );
    this.data.position = vec3.add(
      this.data.position,
      vec3.scale(right, direction[0] * this._movementSpeed), // Gauche/Droite
    );
    this.data.position = vec3.add(
      this.data.position,
      vec3.create(0, direction[1] * this._movementSpeed, 0), // Monter/Descendre
    );

    this.notifyDataChanged();
  }

  public look(delta: Vector2): void {
    this.data.rotation[0] += delta.y * this._lookSensitivity;
    this.data.rotation[1] += delta.x * this._lookSensitivity;
    this.notifyDataChanged();
  }
}
