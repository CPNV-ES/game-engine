import "reflect-metadata";

/**
 * The metadata key used to store the token to inject.
 */
export const INJECT_METADATA_KEY = Symbol("inject");

/**
 * The metadata key used to store the token to inject from the global container.
 */
export const INJECT_GLOBAL_METADATA_KEY = Symbol("inject_global");

/**
 * Decorator used to inject a dependency into a property.
 * @param token - The token of the dependency to inject.
 * @param recursive - Whether to recursively search for the dependency up the hierarchy. (Will also try to resolve from the GameEngineWindow's container)
 * @constructor
 */
export function Inject(token: any, recursive = false): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineMetadata(
      INJECT_METADATA_KEY,
      { token, recursive },
      target,
      propertyKey,
    );
  };
}

/**
 * Decorator used to inject a global dependency into a property.
 * This willONLY inject the dependency from the global / top container. (In game engine, it is the GameEngineWindow)
 * @param token - The token of the global dependency to inject.
 * @constructor
 */
export function InjectGlobal(token: any): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineMetadata(
      INJECT_GLOBAL_METADATA_KEY,
      token,
      target,
      propertyKey,
    );
  };
}
