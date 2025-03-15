import { describe, it, expect } from "vitest";
import { DependencyContainer } from "@core/DependencyInjection/DependencyContainer.ts";

// Define a test class with dependencies
class TestDependency {
  public value: string = "Hello, World!";
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
});
