import Physics from 'game/ecs/components/Physics';

export default class PhysicsSystem {
    update(gameObjects, deltaTime) {
        const physicsEntities = gameObjects.filter(go => go.getComponent('Physics'));
        const colliders = gameObjects.filter(go => go.name === 'Platform');

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
        }
    }
}

