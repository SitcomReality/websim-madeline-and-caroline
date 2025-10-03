# Phase 4: Gasoline Mechanics

## Overview
Implement the gasoline collection, storage, and spraying system. Players collect gasoline from cans, store up to 100 units, and spray it while holding shift. This ties into the particle system for liquid simulation and the fire mechanics for ignition.

## Implementation Steps

### Step 1: Gasoline Resource System
Create a resource management component for the player that tracks gasoline amount (max 100). Include methods to add gasoline, deplete gasoline, and check current amount. This should emit events when gasoline changes so the UI can update.

### Step 2: Update Fuel Can Entities
Modify fuel cans to give 50 gasoline when collected. Add collision detection between the player and fuel cans. When collected, play a particle effect, remove the fuel can, and add gasoline to the player's reserves.

### Step 3: Gasoline Spray Mechanic
Implement gasoline spraying when shift is held. Emit physical gasoline particles in the direction the player is facing. The spray should deplete gasoline reserves at a steady rate. Add particle emitter that creates an arc of particles with appropriate velocity and spread.

### Step 4: Gasoline Pooling
Make gasoline particles stick to surfaces and pool. When multiple gasoline particles are close together on a surface, they should visually merge or cluster. These pooled gasoline particles should be flammable and spread fire when ignited.

### Step 5: Gasoline-Fire Interaction
Update the fire spreading system to interact with gasoline particles and pools. Gasoline should ignite quickly when fire touches it. Burning gasoline should create larger, more intense fires. Consider adding explosive reactions for large gasoline pools.

### Step 6: UI Display
Add a gasoline meter to the HUD that shows current gasoline amount and maximum capacity. Make it visible and easy to read at a glance. Use the cyberpunk theme with neon colors. Consider animating it when gasoline is collected or depleted.

### Step 7: Audio Feedback
Plan for sound effects for gasoline collection, spraying, and ignition. Even if we implement these later, structure the code to easily add audio triggers.

## Notes
The gasoline spray should feel substantial and liquid-like. It shouldn't feel like shooting bullets but more like a fire hose. The amount consumed per second should be tuned so players need to be somewhat careful with their gasoline but not overly conservative. Make collection feel rewarding with good visual and audio feedback.

