import UIComponent from '../../ui/UIComponent.js';
import { createRecentColors, setRecentColor } from 'game/utils/ui';

export default class PropertiesPanel extends UIComponent {
    constructor(editorUI) {
        super();
        this.editorUI = editorUI;
        this.clipboard = null;
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
            { label: 'X', key: 'x', type: 'number', compactGroup: 'pos' },
            { label: 'Y', key: 'y', type: 'number', compactGroup: 'pos' },
            { label: 'W', key: 'width', type: 'number', compactGroup: 'size' },
            { label: 'H', key: 'height', type: 'number', compactGroup: 'size' },
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
                properties.push({ label: 'Burst Size', key: 'burstSize', type: 'number', step: 1 });
            }
        } else if (entity.type === 'ramp') {
            properties.push({ label: 'Angle', key: 'angle', type: 'number', step: 1 });
        }

        // Render compact grouped fields for position and size first
        const posRow = document.createElement('div');
        posRow.className = 'editor-property-row';
        ['x','y'].forEach(k => {
            const wrapper = document.createElement('div'); wrapper.className = 'editor-property compact';
            const label = document.createElement('label'); label.className = 'small-label'; label.textContent = k.toUpperCase();
            const input = document.createElement('input'); input.type = 'number'; input.value = entity[k] !== undefined ? entity[k] : 0;
            input.onchange = (e) => this.updateEntityProperty(entity, k, parseFloat(e.target.value));
            wrapper.appendChild(label); wrapper.appendChild(input); posRow.appendChild(wrapper);
        });
        this.element.appendChild(posRow);

        const sizeRow = document.createElement('div');
        sizeRow.className = 'editor-property-row';
        ['width','height'].forEach(k => {
            const wrapper = document.createElement('div'); wrapper.className = 'editor-property compact';
            const label = document.createElement('label'); label.className = 'small-label'; label.textContent = k === 'width' ? 'W' : 'H';
            const input = document.createElement('input'); input.type = 'number'; input.value = entity[k] !== undefined ? entity[k] : 0;
            input.onchange = (e) => this.updateEntityProperty(entity, k, parseFloat(e.target.value));
            wrapper.appendChild(label); wrapper.appendChild(input); sizeRow.appendChild(wrapper);
        });
        this.element.appendChild(sizeRow);

        // Render remaining properties (skip x,y,width,height already rendered)
        const remaining = [{ label: 'Color', key: 'color', type: 'color' }];
        remaining.forEach(prop => {
            const div = document.createElement('div'); div.className = 'editor-property';
            const label = document.createElement('label'); label.textContent = prop.label; div.appendChild(label);
            const input = document.createElement('input'); input.type = prop.type; input.value = entity[prop.key] || '';
            input.onchange = (e) => {
                let value = e.target.value;
                if (prop.type === 'color') setRecentColor(value);
                this.updateEntityProperty(entity, prop.key, value);
            };
            div.appendChild(input);
            if (prop.type === 'color') div.appendChild(createRecentColors(color => { input.value = color; this.updateEntityProperty(entity, prop.key, color); }));
            this.element.appendChild(div);
        });
        
        // --- Action Buttons ---
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'property-actions';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy Props';
        copyBtn.onclick = () => this.copyProperties(entity);
        actionsDiv.appendChild(copyBtn);

        const pasteBtn = document.createElement('button');
        pasteBtn.textContent = 'Paste Props';
        pasteBtn.disabled = !this.clipboard || this.clipboard.type !== entity.type;
        pasteBtn.onclick = () => this.pasteProperties(entity);
        actionsDiv.appendChild(pasteBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Entity';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => this.editorUI.editorManager.deleteSelected();
        actionsDiv.appendChild(deleteBtn);
        
        this.element.appendChild(actionsDiv);
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
                let value = e.target.value;
                if (prop.type === 'number') {
                    value = parseFloat(e.target.value);
                } else if (prop.type === 'color') {
                    setRecentColor(value);
                }
                settings[prop.key] = value;
                if (prop.key === 'backgroundColor') {
                    this.update(); // Redraw recent colors
                }
            };
            div.appendChild(input);
            
            if (prop.type === 'color') {
                div.appendChild(createRecentColors(color => {
                    input.value = color;
                    settings[prop.key] = color;
                }));
            }

            this.element.appendChild(div);
        });
    }

    updateEntityProperty(entity, key, value) {
        const changes = { [key]: value };
        this.editorUI.editorManager.state.updateEntity(entity, changes);
        this.update();
    }

    copyProperties(entity) {
        const excludedKeys = ['x', 'y', 'width', 'height'];
        this.clipboard = { type: entity.type, props: {} };

        for (const key in entity) {
            if (!excludedKeys.includes(key) && Object.prototype.hasOwnProperty.call(entity, key)) {
                this.clipboard.props[key] = entity[key];
            }
        }
        this.update(); // Re-render to enable paste button
    }

    pasteProperties(entity) {
        if (!this.clipboard || this.clipboard.type !== entity.type) return;

        const changes = { ...this.clipboard.props };
        this.editorUI.editorManager.state.updateEntity(entity, changes);
        this.update();
    }
}