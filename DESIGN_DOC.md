# Madeline & Caroline: Gasoline Discipline Decline - Design & Direction

This document outlines the future creative and technical direction for the game. Our goal is to evolve the current prototype into a more dynamic, stylish, and engaging experience. The core themes we will build upon are chaotic pyromania, fluid and expressive movement, and a "Cyberpunk Inferno" aesthetic.

## 1. Flow and Momentum: The Art of Movement

The current movement system is functional but lacks personality. We will transition to a momentum-based physics model to create a more "flowy" and satisfying feel. The goal is to design a system that is responsive but also has a sense of weight and inertia, making it fun to master.

- **Acceleration & Deceleration:** Player input will no longer result in instant velocity changes. Instead, it will apply force, causing the character to accelerate up to a max speed. Releasing input or changing direction will cause the character to decelerate, creating a slight drift. This will make movement feel more deliberate and weighty.
- **Skill-Based Maneuvers:** This new system will be the foundation for more advanced techniques. We can introduce mechanics like wall-jumps, slides, and mid-air dashes that interact with the character's momentum, rewarding skilled play and creating opportunities for expressive, high-speed navigation.
- **Feel Over Raw Control:** The key principle here is that while instant control feels precise, mastering a system with inertia and momentum feels more rewarding. The movement should be a fun challenge in itself.

## 2. A World of Particles: From Destructive to Decorative

Particles will become a central feature, both mechanically and visually. We will implement a robust particle system capable of handling two distinct types of effects.

- **Physical Particles:** These are tangible game objects that interact with the world's physics. The primary example is gasoline, which will be sprayed as a stream of liquid particles. These particles will collide with surfaces, pool on the ground, and create flammable slicks that can be ignited. This system will also be used for projectiles, debris from explosions, and other physics-based effects.
- **Visual Effect (VFX) Particles:** These particles are purely for aesthetic flair. They will be used to bring the "Neon Flame Graffiti" theme to life. Examples include brilliant sparks from grinding on platforms, glowing embers rising from fires, glitchy trails following fast-moving characters, and spectacular explosions that fill the screen with neon light and smoke.

## 3. The Dynamic Duo: A Flexible Character System

Character switching between Madeline and Caroline will be a core mechanic. To support this and allow for rapid prototyping of their abilities, we will build a flexible, component-based character architecture.

- **Modular Abilities:** Instead of hard-coding abilities to a specific character, we will create an "ability component" system. Abilities like "Double Jump," "Gasoline Spray Pattern," or "Ignition Blast" will be self-contained modules. This will allow us to easily assign, reassign, and tweak abilities for both Madeline and Caroline, fostering experimentation as we define their unique playstyles.
- **Character Stats:** Each character will have a distinct set of base stats (e.g., speed, health, gasoline capacity). These stats will be easily modifiable, further differentiating their roles.
- **Switching Mechanic:** For initial implementation, switching will be instantaneous via the "Enter" key. The underlying system, however, will be designed to accommodate future rules, such as requiring the player to be on the ground, consuming a resource, or incurring a cooldown.

## 4. The Gasoline System: Fuel for the Fire

Gasoline will be elevated from a simple world object to a core player resource that fuels offensive and traversal capabilities.

- **Gasoline Reservoir:** Players will have a gasoline meter displayed on the UI, with a default maximum capacity of 100 units.
- **Resource Collection:** Existing fuel cans in the world will become pickups. Collecting a can will replenish the player's gasoline reservoir by 50 units.
- **Gasoline Spurt Ability:** A new core ability will be added, mapped to the "Shift" key. Holding this key will cause the player to spray gasoline from their reservoir, creating trails and pools of physical liquid particles in the game world. This is the primary way for players to set up their own pyrotechnic traps and combos.

## 5. Beyond the Screen: Camera, Panning, and Minimaps

Levels will grow beyond the confines of a single screen. To support this, we need to implement a camera system and associated navigation tools.

- **Player-Tracking Camera:** The game will feature a camera that smoothly follows the player's movement. It will be designed with "soft zone" logic, allowing the player some freedom of movement before the camera begins to track, preventing distracting micro-movements. The camera will also intelligently look ahead in the direction the player is moving.
- **Editor Panning:** To build and navigate large levels, the map editor will be updated with a panning function. Users will be able to click and drag (e.g., with the middle mouse button or by holding spacebar) to move the canvas view around.
- **Minimap Implementation:** A minimap will be added to both the game and the editor. In-game, it will provide players with an overview of the level layout and their current position. In the editor, it will serve as a high-level navigation tool, allowing the creator to quickly jump to different sections of the map by clicking on the minimap display.

## 6. Cyberpunk Inferno: A UI/UX and Architectural Overhaul

To support the growing complexity of the game and to establish a stronger aesthetic identity, we will undertake a significant refactoring of the UI, UX, and frontend code structure.

- **Thematic Overhaul:** All UI elements—from the main menu to the in-game HUD and editor interface—will be redesigned with a "Cyberpunk Inferno" / "Neon Flame Graffiti" theme. This means bold, glowing neon colors, sharp angular designs, glitch effects, and graffiti-inspired typography.
- **Modular Frontend Architecture:** The `index.html` file will be streamlined to act as a simple container. UI components like menus, modals, and HUD elements will be broken down into their own HTML, CSS, and JS modules. We will use JavaScript to dynamically load and manage these components, keeping the initial HTML payload small and the project structure organized.
- **CSS Restructuring:** The main `style.css` will be broken into smaller, component-specific stylesheets. We will adopt a modular CSS methodology (like BEM or CSS Modules, adapted for our no-bundler environment) to ensure styles are scoped and do not conflict. A global style file will define core variables for colors, fonts, and spacing to maintain visual consistency. This approach will make the UI easier to maintain and scale.

