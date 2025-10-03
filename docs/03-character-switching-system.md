# Phase 3: Character Switching System

## Overview
Implement a flexible character system that allows instant switching between Madeline and Caroline. The system must be designed to easily accommodate changing abilities, stats, and mechanics as gameplay is refined.

## Implementation Steps

### Step 1: Create Character Data Structure
Design a character configuration system that separates character data from the player entity. Each character should have their own stats object including movement speeds, jump forces, special ability cooldowns, and any other character-specific values. Keep this data-driven so it's easy to modify.

### Step 2: Refactor Player Entity
Modify the Player entity to work with character configurations rather than hardcoded values. The player should load a character config and apply its stats. When switching characters, simply load the new config and update all relevant values.

### Step 3: Character Ability Framework
Create an ability system that allows each character to have unique powers. Design this as a component-based system where abilities are modular and can be easily swapped or modified. Each ability should have properties like cooldown, duration, cost, and execution behavior.

### Step 4: Implement Switch Mechanic
Add the character switching keybind (Enter key). When pressed, swap the current character config and update all player stats. Include a brief transition effect using aesthetic particles. Consider adding a cooldown or restriction system that we can enable later if needed for balance.

### Step 5: Visual Differentiation
Ensure Madeline and Caroline are visually distinct. Give them different colors, potentially different sizes, and different particle effects. The player should always know which character they're controlling at a glance.

### Step 6: Character-Specific Particles
Link particle effects to the active character. Each character should have their own colored trails, dash effects, and other aesthetic particles. This reinforces the character identity and makes switching feel impactful.

### Step 7: UI Indicators
Add UI elements that show which character is active, what abilities are available, and their cooldown states. This should be minimal but clear. Consider showing the inactive character in a corner as a portrait or icon.

## Notes
Keep the ability system extremely flexible. We don't know final character designs yet, so avoid hardcoding specific behaviors. The switching should feel instant and satisfying with clear visual feedback. Consider adding unique movement feels per character (different acceleration rates, max speeds, etc.) to make them feel truly different.

