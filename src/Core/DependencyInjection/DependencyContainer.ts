import { INJECT_METADATA_KEY } from "@core/DependencyInjection/Inject.ts";

/**
 * A simple dependency container that allows for registering and resolving dependencies.
 */
export class DependencyContainer {
  private dependencies = new Map<Function, any>();

  /**
   * Register an instance of a class to be resolved when requested.
   * @param token - The token of the class to register (in form of a constructor).
   * @param instance - The instance to register.
   */
  register<T>(token: abstract new (...args: any[]) => T, instance: T): void {
    this.dependencies.set(token, instance);
  }

  /**
   * Resolve an instance of a class.
   * @param token - The token of the class to resolve (in form of a constructor).
   */
  resolve<T>(token: abstract new (...args: any[]) => T): T {
    const instance = this.dependencies.get(token);
    if (!instance) {
      throw new Error(`No instance registered for ${token.name}`);
    }
    return instance;
  }

  /**
   * Fill all dependencies with a target object.
   * @param target - The target object to fill dependencies for.
   */
  fillDependencies(target: any): void {
    for (const key of Object.keys(target)) {
      const token = Reflect.getMetadata(INJECT_METADATA_KEY, target, key);
      if (token) {
        target[key] = this.resolve(token);
      }
    }
  }
}
