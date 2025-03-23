---
title: Game Object Debugger
---
# Game Object Debugger

## Overview
The **Game Object Debugger** is a tool designed to visualize and manipulate game objects in a **Game Engine Window** using a GUI. This debugger allows developers to view and modify game objects properties dynamically, including their behaviors, transformations, and child objects.

## Dependencies
The debugger relies on the following dependencies:

### 1. **[lil-gui](https://github.com/georgealways/lil-gui)**
   - A lightweight GUI library used to create the debugging interface.
   - Used for dynamically creating folders and controls for game object properties.

### 2. **Game Engine Core Modules**
   - `Behavior`: Represents behaviors that can be attached to game objects.
   - `GameEngineWindow`: The central window root that contains all game objects.
   - `GameObject`: Represents an entity in the game engine.

## How to Use the Debugger
### **1. Import the Debugger in Your HTML**
```html
<script type="module" src="@extensions/Debugger/DraggableElement.ts"></script>
```
- Ensure the debugger script is correctly imported in your project.
- This makes the debugger accessible during runtime.

### **3. Test with Sample Game Objects**
```typescript
const childGameObject1: GameObject = new GameObject();
const childGameObject2: GameObject = new GameObject();
const grandChildGameObject: GameObject = new GameObject();

gameEngineWindow.root.addChild(childGameObject1);
gameEngineWindow.root.addChild(childGameObject2);
childGameObject1.addChild(grandChildGameObject);
childGameObject1.addBehavior(new TestBehavior());
```
- Create game objects and add them to the root.
- Assign behaviors to observe how they appear in the debugger.

## Features & Functionality
- **Hierarchy View**: View all game objects as a structured tree.
- **Live Editing**: Modify game object properties in real-time.
- **Behavior Inspection**: View and tweak behaviors dynamically.
- **Object Manipulation**:
  - Rename objects
  - Adjust transformations
  - Add/remove child objects