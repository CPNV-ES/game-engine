import "reflect-metadata";

/**
 * The metadata key used to store the token to inject.
 */
export const INJECT_METADATA_KEY = Symbol("inject");

/**
 * Decorator used to inject a dependency into a property.
 * @param token - The token of the dependency to inject.
 * @constructor
 */
export function Inject(token: any): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.defineMetadata(INJECT_METADATA_KEY, token, target, propertyKey);
  };
}
