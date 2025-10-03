import Tool from 'game/editor/tools/Tool';

export default class EnemySpawnerTool extends Tool {
    onClick(x, y) {
        const entity = {
            x: x - 16,
            y: y - 16,
            width: 32,
            height: 32,
            color: '#ff00ff',
            type: 'enemy_spawner',
            enemyType: 'basic',
            spawnInterval: 5.0
        };
        this.editorManager.addEntity(entity);
    }
}

