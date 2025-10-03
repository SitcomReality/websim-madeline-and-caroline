# Phase 1: Movement System Overhaul

## Overview
Replace the current instant-response movement system with momentum-based physics that creates a satisfying, flowy feel. The player should feel like they're controlling a character with weight and inertia, not just moving a box around.

## Implementation Steps

### Step 1: Update Physics Component
Modify the Physics component to support acceleration-based movement instead of instant velocity changes. Add properties for acceleration rate, max speed, friction/drag, and air resistance. The component should track both ground and air states separately since they should feel different.

### Step 2: Refactor PlayerController
Update the PlayerController to work with acceleration instead of setting velocity directly. When the player presses a movement key, apply acceleration in that direction. When they release, apply friction to gradually slow down. Make sure to have different values for ground friction versus air resistance so movement feels different when jumping.

### Step 3: Add Momentum to Jumping
Change jumping from an instant velocity change to something that feels more dynamic. Consider adding variable jump height based on how long the jump button is held. Add some horizontal momentum preservation when jumping so the character maintains their speed in the air.

### Step 4: Implement Dash/Slide Mechanics
Since we want "flowy" movement, add a dash or slide mechanic that the player can use to maintain momentum. This could be a quick burst of speed that carries the character forward, making platforming feel more dynamic and giving skilled players something to master.

### Step 5: Fine-tune Values
Create a constants file specifically for movement tuning. Include acceleration rates, max speeds, friction values, jump forces, dash speeds, and any other movement parameters. These should be easy to adjust without digging through code. Test extensively to find values that feel satisfying.

### Step 6: Add Movement State Machine
Implement a state machine for the player that tracks states like idle, running, jumping, falling, dashing, sliding. This will make it easier to apply different physics rules in different situations and will be essential when we add character-specific abilities.

## Notes
The goal is movement that responds immediately to input but has weight and flow. Think games like Celeste or Super Meat Boy where the character feels responsive but momentum creates satisfying arcs and flow. Avoid floaty or sluggish feeling movement.

