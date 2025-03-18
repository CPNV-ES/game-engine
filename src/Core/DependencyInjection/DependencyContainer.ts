/**
 * A type that can be used as a token for resolving dependencies.
 */
export type Token<T> = string | (new (...args: any[]) => T);

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
  register<T>(token: Token<T>, instance: T): void {
    this.dependencies.set(this.getTokenString(token), instance);
  }

  /**
   * Unregister a class.
   * @param token
   */
  unregister<T>(token: Token<T>): void {
    this.dependencies.delete(this.getTokenString(token));
  }
  /**
   * Resolve an instance of a class.
   * @param token - The token of the class to resolve (in form of a constructor).
   */
  resolve<T>(token: Token<T>): T {
    const tokenString = this.getTokenString(token);
    const instance = this.dependencies.get(tokenString);
    if (!instance) {
      throw new Error(`No instance registered for ${tokenString}`);
    }
    return instance;
  }
  /**
   * Does a class exist in the container.
   * @param token
   */
  exists<T>(token: Token<T>): boolean {
    return this.dependencies.has(this.getTokenString(token));
  }

  private getTokenString(token: Token<any>): string {
    return typeof token === "string" ? token : token.name;
  }
}
