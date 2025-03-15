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

  it("should unregister a dependency using the class name", () => {
    const container = new DependencyContainer();
    const dependency = new TestDependency();

    // Register the dependency using the class name
    container.registerWithClassName("TestDependency", dependency);

    // Unregister the dependency using the class name
    container.unregisterWithClassName("TestDependency");

    // Attempt to resolve the unregistered dependency
    expect(() => container.resolve(TestDependency)).toThrowError(
      `No instance registered for TestDependency`,
    );
  });

  it("should throw an error when resolving an unregistered dependency", () => {
    const container = new DependencyContainer();

    // Attempt to resolve an unregistered dependency
    expect(() => container.resolve(TestDependency)).toThrowError(
      `No instance registered for TestDependency`,
    );
  });

  it("should check if a dependency exists using the class token", () => {
    const container = new DependencyContainer();
    const dependency = new TestDependency();

    // Register the dependency
    container.register(TestDependency, dependency);

    // Check if the dependency exists using the class token
    expect(container.exists(TestDependency)).toBe(true);

    // Unregister the dependency
    container.unregister(TestDependency);

    // Check if the dependency exists after unregistering
    expect(container.exists(TestDependency)).toBe(false);
  });

  it("should check if a dependency exists using the class name", () => {
    const container = new DependencyContainer();
    const dependency = new TestDependency();

    // Register the dependency using the class name
    container.registerWithClassName("TestDependency", dependency);

    // Check if the dependency exists using the class name
    expect(container.existsWithClassName("TestDependency")).toBe(true);

    // Unregister the dependency using the class name
    container.unregisterWithClassName("TestDependency");

    // Check if the dependency exists after unregistering
    expect(container.existsWithClassName("TestDependency")).toBe(false);
  });

  it("should return false for unregistered dependencies", () => {
    const container = new DependencyContainer();

    // Check if an unregistered dependency exists using the class token
    expect(container.exists(TestDependency)).toBe(false);

    // Check if an unregistered dependency exists using the class name
    expect(container.existsWithClassName("TestDependency")).toBe(false);
  });
});
