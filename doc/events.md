# Event System

## Overview

The `Event` class is a class that allows you to add observers to an event and emit the event with data of type `T`. This class is essential for implementing an event-driven architecture in our project, enabling different parts of the application to communicate with each other in a decoupled manner.

## How It Works

### Adding Observers

You can add observers (callback functions) to an event using the `addObserver` method. These observers will be called whenever the event is emitted.

### Removing Observers

You can remove observers from an event using the `removeObserver` method. Once removed, the observer will no longer be called when the event is emitted.

### Emitting Events

You can emit an event using the `emit` method. This will call all the observers with the provided data.

## Importance in Our Project

The `Event` class is crucial for our project as it allows different components to communicate without being tightly coupled. This makes the code more modular, easier to maintain, and test. For example, the rendering engine can emit events when a frame is rendered, and other components can listen to these events to perform actions like updating the UI or logging performance metrics.

## Usage Example

Here is an example of how to use the `Event` class in our project:

```typescript
// Import the Event class
import { Event } from 'sprunk-engine';

// Define a type for the event data
type UserData = {
  id: number;
  name: string;
};

// Create an instance of the Event class
const userLoggedInEvent = new Event<UserData>();

// Define an observer function
const onUserLoggedIn = (data: UserData) => {
  console.log(`User logged in: ${data.name}`);
};

// Add the observer to the event
userLoggedInEvent.addObserver(onUserLoggedIn);

// Emit the event with some data
userLoggedInEvent.emit({ id: 1, name: 'John Doe' });

// Remove the observer from the event
userLoggedInEvent.removeObserver(onUserLoggedIn);