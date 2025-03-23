---
title: Physics Engine
children:
  - ./collision-resolution.md
  - ./sat.md
---
# Overview of the physics engine
This system is responsible for handling the basic physics of the games. It can process standard physics operations such as collision detection and collision resolution. The physics engine is designed to be modular and can be easily extended to support different types of physics operations.

## Components Overview
### 1. PhysicsGameEngineComponent
This is the main class of the engine. It is responsible for handling the physics (launching the collision detection and resolution) at each game tick. It will also trigger the events on the colliders depending on what's happening in the game.

### 2. Collider
The Collider represents a physical object in the game. it is a behaviour in term of our game engine. It has an observer pattern to notify the subscribed instances when a collision with another Collider is detected.

### 3. PolygonCollider
As a Collider is not useful by itself, we have a PolygonCollider that is a Collider with a polygon shape. It is used to represent the shape and position of an object in the game.

## How It Works
While the game is running, the PhysicsGameEngineComponent will check for collisions between all the Colliders in the game. This process is made by looping on each Colliders and checking if a collision is detected, it will trigger the collision event on the Colliders involved in the collision. The Colliders can then respond to the collision by changing their state or triggering other events.