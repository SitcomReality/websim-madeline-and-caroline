# Phase 2: Particle Systems

## Overview
Implement two distinct particle systems: physical particles that interact with the world and aesthetic particles purely for visual effects. Physical particles will be used for gasoline liquid simulation and projectiles, while aesthetic particles create spectacular visual feedback.

## Implementation Steps

### Step 1: Create Base Particle Class
Build a foundational Particle class that can be extended for both physical and aesthetic particles. Include basic properties like position, velocity, lifetime, color, and size. Keep this lightweight since we'll potentially have hundreds of particles active at once.

### Step 2: Physical Particle System
Create a PhysicalParticle class that extends the base Particle. These particles need Transform and Physics components to interact with the world. Implement collision detection with platforms and other game objects. These will be pooled and reused for performance.

### Step 3: Aesthetic Particle System
Create an AestheticParticle class for visual effects. These don't need collision and can use simpler physics or just interpolation. Include properties for fade-in/fade-out, color shifts over lifetime, and size changes. These should be extremely lightweight.

### Step 4: Particle Emitter System
Build an emitter system that can spawn particles with various patterns. Support for continuous emission (like a trail) and burst emission (like an explosion). Include control over spawn rate, spread angle, velocity ranges, and lifetime ranges.

### Step 5: Gasoline Liquid Simulation
Using physical particles, create a gasoline spray system. When the player holds shift, emit physical particles in the direction they're facing. These particles should have gravity, bounce off surfaces, and pool on platforms. They should be flammable and spread fire when ignited.

### Step 6: Visual Effect Particles
Create particle effects for key actions: character switching, dashing, landing after a jump, fire ignition, gasoline spray, and explosions. Use aesthetic particles for these so they don't impact performance. Make them vibrant and satisfying with the cyberpunk neon theme in mind.

### Step 7: Particle Manager
Implement a ParticleManager system that handles pooling, updating, and rendering all particles efficiently. This should batch particle rendering for performance and automatically clean up dead particles.

## Notes
Performance is critical here. Use object pooling aggressively. Consider using a separate canvas layer for particles if performance becomes an issue. The gasoline simulation should feel viscous and liquid-like but not too realistic that it becomes hard to control.

