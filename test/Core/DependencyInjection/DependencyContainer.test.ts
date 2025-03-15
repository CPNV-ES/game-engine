import { describe, it, expect } from "vitest";
import { DependencyContainer } from "@core/DependencyInjection/DependencyContainer.ts";
import { INJECT_METADATA_KEY } from "@core/DependencyInjection/Inject.ts";

// Define a test class with dependencies
class TestDependency {
  public value: string = "Hello, World!";
}

class TestClass {
  @Reflect.metadata(INJECT_METADATA_KEY, TestDependency)
  public dependency!: TestDependency;
}

describe("DependencyContainer", () => {
  it("should register and resolve a dependency", () => {
    const container = new DependencyContainer();
    const dependency = new TestDependency();

    // Register the dependency
    container.register(TestDependency, dependency);

    // Resolve the dependency
    const resolvedDependency = container.resolve(TestDependency);

    // Verify the resolved dependency matches the registered instance
    expect(resolvedDependency).toBe(dependency);
    expect(resolvedDependency.value).toBe("Hello, World!");
  });

  it("should throw an error when resolving an unregistered dependency", () => {
    const container = new DependencyContainer();

    // Attempt to resolve an unregistered dependency
    expect(() => container.resolve(TestDependency)).toThrowError(
      `No instance registered for TestDependency`,
    );
  });

  it("should fill dependencies in a target object", () => {
    const container = new DependencyContainer();
    const dependency = new TestDependency();

    // Register the dependency
    container.register(TestDependency, dependency);

    // Create a target object with a dependency
    const target = new TestClass();

    // Fill dependencies in the target object
    container.fillDependencies(target);

    // Verify the dependency was injected correctly
    expect(target.dependency).toBe(dependency);
    expect(target.dependency.value).toBe("Hello, World!");
  });

  it("should not fill dependencies for properties without metadata", () => {
    const container = new DependencyContainer();
    const dependency = new TestDependency();

    // Register the dependency
    container.register(TestDependency, dependency);

    // Create a target object with a non-injected property
    class TestClassWithoutMetadata {
      public nonInjectedProperty: string = "No dependency here!";
    }

    const target = new TestClassWithoutMetadata();

    // Fill dependencies in the target object
    container.fillDependencies(target);

    // Verify the non-injected property remains unchanged
    expect(target.nonInjectedProperty).toBe("No dependency here!");
  });
});
