# Editor to Game Integration

## Overview
This document outlines the changes needed in the game engine to support the new entity types added to the map editor.

## Entity Types to Support

### 1. Deadly Platforms
**Editor Property**: `killsPlayer: boolean`
**Implementation**:
- Add collision detection in PhysicsSystem or PlayerController
- Check platform's `killsPlayer` property on collision
- Trigger player death/respawn when touched
- Consider adding visual distinction (red glow, spikes, etc.)

### 2. Fuel Cans
**Editor Property**: Already implemented
**Current Status**: 
**Note**: FuelCan entities already spawn and work in game

### 3. Ramps/Triangular Platforms
**Editor Properties**: `type: 'ramp'`, `angle: number`, `width`, `height`
**Implementation**:
- Create new RampCollider or extend PhysicsSystem
- Implement slope collision detection (normal-based physics)
- Player should slide/walk up ramps naturally
- Physics velocity should be redirected based on ramp angle
- May need to create a new Ramp entity factory function

### 4. Enemy Spawners
**Editor Properties**: `enemyType: string`, `spawnInterval: number`
**Implementation**:
- Create EnemySpawner entity/component
- Implement spawn timer and enemy creation
- Create basic enemy types (basic, flying, turret)
- Add enemy AI components
- Enemies should be separate GameObjects with their own controllers

### 5. Particle Emitters
**Editor Properties**: `particleType: 'aesthetic'|'physical'`, `emitRate: number`, `particleColor: string`
**Implementation**:
- Create ParticleEmitterComponent
- Integrate with existing ParticleSystem
- Continuous emission based on `emitRate`
- Use `particleType` to determine if AestheticParticle or PhysicalParticle
- Apply `particleColor` to emitted particles

### 6. Player Start Location
**Editor Property**: `type: 'player_start'`
**Implementation**:
- In GameScene.init(), check for player_start entity in level data
- If found, spawn player at that location instead of default (100, 100)
- If not found, fall back to default spawn location
- Should only be one player start per level

### 7. Exit Door / Level End
**Editor Property**: `type: 'exit_door'`
**Implementation**:
- Create ExitDoor entity with collision detection
- On player collision, trigger level complete sequence
- Could show completion UI, stats, next level button
- Integrate with level progression system (future)
- Consider adding animation/visual feedback

## Level Loading Changes

### GameScene Initialization
Update `GameScene.init()` to process all entity types:

```javascript
if (this.level && Array.isArray(this.level.entities)) {
    // Find and set player start
    const playerStart = this.level.entities.find(e => e.type === 'player_start');
    const startX = playerStart ? playerStart.x : 100;
    const startY = playerStart ? playerStart.y : 100;

    // Create entities by type
    this.level.entities.forEach(e => {
        switch(e.type) {
            case 'platform':
                const platform = createPlatform(e.x, e.y, e.width, e.height);
                if (e.killsPlayer) {
                    platform.deadly = true; // or add DeadlyComponent
                }
                this.addGameObject(platform);
                break;
            case 'fuel':
                this.addGameObject(createFuelCan(e.x, e.y));
                break;
            case 'ramp':
                this.addGameObject(createRamp(e.x, e.y, e.width, e.height, e.angle));
                break;
            case 'enemy_spawner':
                this.addGameObject(createEnemySpawner(e.x, e.y, e.enemyType, e.spawnInterval));
                break;
            case 'particle_emitter':
                this.addGameObject(createParticleEmitter(e.x, e.y, e.particleType, e.emitRate, e.particleColor));
                break;
            case 'exit_door':
                this.addGameObject(createExitDoor(e.x, e.y, e.width, e.height));
                break;
        }
    });
}
``` 