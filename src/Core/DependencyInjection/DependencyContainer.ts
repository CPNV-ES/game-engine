/**
 * A simple dependency container that allows for registering and resolving dependencies.
 */
export class DependencyContainer {
  private dependencies = new Map<string, any>();

  /**
   * Register an instance of a class to be resolved when requested.
   * @param token - The token of the class to register (in form of a constructor).
   * @param instance - The instance to register.
   */
  register<T>(token: new (...args: any[]) => T, instance: T): void {
    this.dependencies.set(token.name, instance);
  }

  /**
   * Register an instance of a class to be resolved when requested.
   * @param className - The constructor name of the class to register.
   * @param instance - The instance to register.
   */
  registerWithClassName<T>(className: string, instance: T): void {
    this.dependencies.set(className, instance);
  }

  /**
   * Unregister a class.
   * @param token
   */
  unregister<T>(token: new (...args: any[]) => T): void {
    this.dependencies.delete(token.name);
  }

  /**
   * Unregister an instance of a class.
   * @param className - The constructor name of the class to unregister.
   */
  unregisterWithClassName(className: string): void {
    this.dependencies.delete(className);
  }

  /**
   * Resolve an instance of a class.
   * @param token - The token of the class to resolve (in form of a constructor).
   */
  resolve<T>(token: new (...args: any[]) => T): T {
    const instance = this.dependencies.get(token.name);
    if (!instance) {
      throw new Error(`No instance registered for ${token.name}`);
    }
    return instance;
  }
}
