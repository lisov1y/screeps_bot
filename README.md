# Screeps Codebase

This repository contains a codebase for Screeps, an MMO strategy game where you program the AI of your units (called creeps). This README outlines the core structure and functionality of the project.

## Table of Contents
- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Code Structure](#code-structure)
- [Creep Roles](#creep-roles)
  - [Harvester](#harvester)
  - [Builder](#builder)
  - [Upgrader](#upgrader)
- [Game Logic](#game-logic)
  - [Memory Management](#memory-management)
  - [Creep Spawning](#creep-spawning)
  - [Creep Behavior](#creep-behavior)
---

## Project Overview
This Screeps codebase is designed to automate basic gameplay elements:
- Harvesting resources.
- Building structures.
- Upgrading the controller.

The goal is to provide an extendable and maintainable starting point for gameplay automation, focusing on simplicity and efficiency.

## Setup Instructions
1. Clone this repository to your local machine.
2. Sync the code to your Screeps account using your preferred IDE or the Screeps in-game editor.
3. Start the Screeps simulation or live game to test the behavior of your creeps.

## Code Structure
The codebase is organized as follows:
- **`main.js`**: The main game loop that coordinates all actions.
- **`role.harvester.js`**: Contains logic for harvesting energy and delivering it to structures.
- **`role.builder.js`**: Manages the building of structures using energy.
- **`role.upgrader.js`**: Handles upgrading the room controller.

## Creep Roles
Creeps in this codebase are assigned specific roles based on the game’s needs.

### Harvester
- **Responsibilities**: Harvests energy from sources and transfers it to spawn, extensions, or towers.
- **Behavior**:
  - Identifies the closest active energy source to harvest.
  - Transfers energy to structures needing it most.
- **Key Methods**:
  - `harvestEnergy(creep)`
  - `transferEnergy(creep)`

### Builder
- **Responsibilities**: Constructs structures and gathers energy when needed.
- **Behavior**:
  - Switches between harvesting energy and building structures based on energy levels.
  - Prioritizes construction sites by distance, progress, and importance.
- **Key Methods**:
  - `buildConstruction(creep)`
  - `findConstructionSite(creep)`

### Upgrader
- **Responsibilities**: Upgrades the room controller to improve overall functionality.
- **Behavior**:
  - Switches between harvesting energy and upgrading the controller based on energy levels.
  - Prioritizes the nearest energy source for harvesting.
- **Key Methods**:
  - `upgradeController(creep)`
  - `findEnergySource(creep)`

## Game Logic
The core logic is encapsulated in the `main.js` file, which handles:

### Memory Management
- Cleans up memory of creeps that no longer exist to avoid clutter and potential errors.
- Uses the `cleanUpMemory()` function for maintenance.

### Creep Spawning
- Dynamically spawns creeps based on the current needs of the room:
  - Maintains a minimum number of harvesters, builders, and upgraders.
  - Adjusts spawning logic based on energy availability and room level.
- Uses the `spawnCreepsIfNeeded()` and `spawnCreep(role)` functions to manage creep production.

### Creep Behavior
- Assigns specific behaviors to creeps based on their roles.
- Uses the `runCreeps()` function to delegate tasks to each creep.
