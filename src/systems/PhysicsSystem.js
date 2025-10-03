import Physics from 'game/ecs/components/Physics';

export default class PhysicsSystem {
    update(gameObjects, deltaTime) {
        const physicsEntities = gameObjects.filter(go => go.getComponent('Physics'));
        const colliders = gameObjects.filter(go => go.name === 'Platform');
        const ramps = gameObjects.filter(go => go.name === 'Ramp');

        for (const entity of physicsEntities) {
            const physics = entity.getComponent('Physics');
            const transform = entity.transform;

            // Apply gravity
            physics.velocity.y += physics.gravity * deltaTime;
            
            // Update position
            transform.position.x += physics.velocity.x * deltaTime;
            transform.position.y += physics.velocity.y * deltaTime;

            // Basic collision detection
            physics.onGround = false;
            for (const platform of colliders) {
                const platTransform = platform.transform;
                if (
                    transform.position.x < platTransform.position.x + platTransform.size.x &&
                    transform.position.x + transform.size.x > platTransform.position.x &&
                    transform.position.y + transform.size.y > platTransform.position.y &&
                    transform.position.y < platTransform.position.y + platTransform.size.y
                ) {
                    // Collision occurred, simple resolution: move entity on top of platform
                    const prevY = transform.position.y - physics.velocity.y * deltaTime;
                    if (prevY + transform.size.y <= platTransform.position.y) {
                        transform.position.y = platTransform.position.y - transform.size.y;
                        physics.velocity.y = 0;
                        physics.onGround = true;
                    }
                }
            }

            // Ramp collision detection
            for (const ramp of ramps) {
                const rampTransform = ramp.transform;
                const rampAngle = ramp.angle || 45; // TODO: handle different ramp directions

                const footX = transform.position.x + transform.size.x / 2;
                const footY = transform.position.y + transform.size.y;

                if (
                    footX >= rampTransform.position.x &&
                    footX <= rampTransform.position.x + rampTransform.size.x &&
                    footY >= rampTransform.position.y &&
                    footY <= rampTransform.position.y + rampTransform.size.y + 10 // buffer
                ) {
                    const relativeX = footX - rampTransform.position.x;
                    const rampHeightAtX = relativeX * Math.tan(rampAngle * Math.PI / 180);
                    const rampSurfaceY = rampTransform.position.y + rampTransform.size.y - rampHeightAtX;
                    
                    if (footY >= rampSurfaceY) {
                         // A simple approximation. More robust physics would be needed for perfect sliding.
                        transform.position.y = rampSurfaceY - transform.size.y;
                        physics.velocity.y = 0;
                        physics.onGround = true;
                    }
                }
            }
        }
    }
}