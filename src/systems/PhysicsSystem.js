import Physics from 'game/ecs/components/Physics';

export default class PhysicsSystem {
    update(gameObjects, deltaTime) {
        const physicsEntities = gameObjects.filter(go => go.getComponent('Physics'));
        const colliders = gameObjects.filter(go => go.name === 'Platform');
        const ramps = gameObjects.filter(go => go.name === 'Ramp');

        for (const entity of physicsEntities) {
            const physics = entity.getComponent('Physics');
            const transform = entity.transform;
            physics.onGround = false;

            // Apply gravity
            physics.velocity.y += physics.gravity * deltaTime;
            
            // --- X Movement and Collision ---
            transform.position.x += physics.velocity.x * deltaTime;
            // TODO: Add horizontal collision with platforms

            // --- Y Movement and Collision ---
            transform.position.y += physics.velocity.y * deltaTime;

            // Platform collision detection
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
                    if (physics.velocity.y >= 0 && prevY + transform.size.y <= platTransform.position.y) {
                        transform.position.y = platTransform.position.y - transform.size.y;
                        physics.velocity.y = 0;
                        physics.onGround = true;
                    }
                }
            }

            // Ramp collision detection and response
            for (const ramp of ramps) {
                const rampTransform = ramp.transform;
                
                const playerBottom = transform.position.y + transform.size.y;
                const playerCenter = transform.position.x + transform.size.x / 2;

                // Simple bounding box check first
                if (
                    playerCenter >= rampTransform.position.x &&
                    playerCenter <= rampTransform.position.x + rampTransform.size.x &&
                    playerBottom >= rampTransform.position.y &&
                    transform.position.y <= rampTransform.position.y + rampTransform.size.y
                ) {
                    const relativeX = playerCenter - rampTransform.position.x;
                    // For now, we assume a ramp sloping up from left to right
                    // The "surface" is at the top of the ramp's bounding box.
                    const rampSurfaceY = rampTransform.position.y + rampTransform.size.y * (1 - (relativeX / rampTransform.size.x));
                    
                    if (playerBottom > rampSurfaceY) {
                        // Correct position
                        transform.position.y = rampSurfaceY - transform.size.y;
                        
                        // Recalculate forces along the slope
                        const slopeAngle = Math.atan2(rampTransform.size.y, rampTransform.size.x);
                        const gravity = physics.gravity;

                        // Force pulling down the slope
                        const slopeForce = gravity * Math.sin(slopeAngle);
                        
                        // Adjust velocity to be parallel to the ramp surface
                        const speed = Math.sqrt(physics.velocity.x**2 + physics.velocity.y**2);
                        const currentAngle = Math.atan2(physics.velocity.y, physics.velocity.x);
                        
                        // Project player's velocity onto the slope
                        // This prevents bouncing and makes movement smooth
                        const velocityAlongSlope = physics.velocity.x * Math.cos(slopeAngle) + physics.velocity.y * Math.sin(slopeAngle);
                        physics.velocity.x = velocityAlongSlope * Math.cos(slopeAngle);
                        physics.velocity.y = velocityAlongSlope * Math.sin(slopeAngle);
                        
                        // Apply sliding force
                        physics.velocity.x += slopeForce * Math.cos(slopeAngle) * deltaTime;
                        physics.velocity.y += slopeForce * Math.sin(slopeAngle) * deltaTime;
                        
                        physics.onGround = true;
                    }
                }
            }
        }
    }
}