import UIComponent from '../../ui/UIComponent.js';

export default class PropertiesPanel extends UIComponent {
    constructor(editorUI) {
        super();
        this.editorUI = editorUI;
    }

    init() {
        this.createElement('div', 'editor-properties', this.editorUI.container);
        this.update();
    }

    update() {
        const state = this.editorUI.editorManager.state;
        const selected = state.selectedEntity;

        this.element.innerHTML = '<h3>Properties</h3>';

        if (selected) {
            this.renderEntityProperties(selected);
        } else {
            this.renderLevelSettings(state.levelSettings);
        }
    }

    renderEntityProperties(entity) {
        const properties = [
            { label: 'X Position', key: 'x', type: 'number' },
            { label: 'Y Position', key: 'y', type: 'number' },
            { label: 'Width', key: 'width', type: 'number' },
            { label: 'Height', key: 'height', type: 'number' },
            { label: 'Color', key: 'color', type: 'color' }
        ];

        // Add type-specific properties
        if (entity.type === 'platform') {
            properties.push({ label: 'Kills Player', key: 'killsPlayer', type: 'checkbox' });
        } else if (entity.type === 'enemy_spawner') {
            properties.push({ label: 'Enemy Type', key: 'enemyType', type: 'select', options: ['basic', 'flying', 'turret'] });
            properties.push({ label: 'Spawn Interval', key: 'spawnInterval', type: 'number', step: 0.1 });
        } else if (entity.type === 'particle_emitter') {
            const ps = this.editorUI.editorManager.game.sceneManager.scenes.game.particleSystem;
            const emitterTypes = ps ? ps.getAvailableEmitterTypes() : ['magic_sparkle', 'debris'];
            properties.push({ label: 'Emitter Type', key: 'emitterType', type: 'select', options: emitterTypes });
            properties.push({ label: 'Particle Color', key: 'particleColor', type: 'color' });
            properties.push({ label: 'Emit Rate (/s)', key: 'emitRate', type: 'number' });
            properties.push({ label: 'Emission Angle', key: 'angle', type: 'number', step: 1 });
            properties.push({ label: 'Emission Cone (°)', key: 'cone', type: 'number', step: 1 });
            properties.push({ label: 'Burst Mode', key: 'burstMode', type: 'checkbox' });
            if (entity.burstMode) {
                properties.push({ label: 'Burst Interval (s)', key: 'burstInterval', type: 'number', step: 0.1 });
            }
        } else if (entity.type === 'ramp') {
            properties.push({ label: 'Angle', key: 'angle', type: 'number', step: 1 });
        }

        properties.forEach(prop => {
            const div = document.createElement('div');
            div.className = 'editor-property';

            const label = document.createElement('label');
            label.textContent = prop.label;
            div.appendChild(label);

            if (prop.type === 'select') {
                const select = document.createElement('select');
                select.value = entity[prop.key] || prop.options[0];
                prop.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });
                select.onchange = (e) => this.updateEntityProperty(entity, prop.key, e.target.value);
                div.appendChild(select);
            } else if (prop.type === 'checkbox') {
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = entity[prop.key] || false;
                input.onchange = (e) => this.updateEntityProperty(entity, prop.key, e.target.checked);
                div.appendChild(input);
            } else {
                const input = document.createElement('input');
                input.type = prop.type;
                if (prop.step) input.step = prop.step;
                input.value = entity[prop.key] !== undefined ? entity[prop.key] : (prop.type === 'number' ? 0 : '');
                input.onchange = (e) => {
                    const value = prop.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                    this.updateEntityProperty(entity, prop.key, value);
                };
                div.appendChild(input);
            }

            this.element.appendChild(div);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Entity';
        deleteBtn.onclick = () => this.editorUI.editorManager.deleteSelected();

        const btnDiv = document.createElement('div');
        btnDiv.className = 'editor-property';
        btnDiv.appendChild(deleteBtn);
        this.element.appendChild(btnDiv);
    }

    renderLevelSettings(settings) {
        const properties = [
            { label: 'Level Name', key: 'name', type: 'text' },
            { label: 'Width', key: 'width', type: 'number' },
            { label: 'Height', key: 'height', type: 'number' },
            { label: 'Background', key: 'backgroundColor', type: 'color' },
            { label: 'Gravity', key: 'gravity', type: 'number' }
        ];

        properties.forEach(prop => {
            const div = document.createElement('div');
            div.className = 'editor-property';

            const label = document.createElement('label');
            label.textContent = prop.label;
            div.appendChild(label);

            const input = document.createElement('input');
            input.type = prop.type;
            input.value = settings[prop.key];
            input.onchange = (e) => {
                const value = prop.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                settings[prop.key] = value;
            };
            div.appendChild(input);

            this.element.appendChild(div);
        });
    }

    updateEntityProperty(entity, key, value) {
        const changes = { [key]: value };
        this.editorUI.editorManager.state.updateEntity(entity, changes);
        this.update();
    }
}