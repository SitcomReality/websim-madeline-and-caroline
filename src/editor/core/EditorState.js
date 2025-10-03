import EditorHistory from 'game/editor/core/EditorHistory';

export default class EditorState {
    constructor() {
        this.entities = [];
        this.selectedEntity = null;
        this.history = new EditorHistory();
        this.levelSettings = {
            width: 800,
            height: 600,
            backgroundColor: '#1e1e2e',
            gravity: 980,
            name: 'Untitled Level'
        };
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.history.recordAction({
            type: 'add',
            entity: { ...entity }
        });
    }

    deleteEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            this.history.recordAction({
                type: 'delete',
                entity: { ...entity },
                index: index
            });
            if (this.selectedEntity === entity) {
                this.selectedEntity = null;
            }
        }
    }

    updateEntity(entity, changes) {
        const oldState = { ...entity };
        Object.assign(entity, changes);
        this.history.recordAction({
            type: 'update',
            entity: entity,
            oldState: oldState,
            newState: { ...entity }
        });
    }

    selectEntity(entity) {
        this.selectedEntity = entity;
    }

    deselectEntity() {
        this.selectedEntity = null;
    }

    undo() {
        const action = this.history.undo();
        if (action) {
            this.applyAction(action, true);
        }
    }

    redo() {
        const action = this.history.redo();
        if (action) {
            this.applyAction(action, false);
        }
    }

    applyAction(action, isUndo) {
        switch (action.type) {
            case 'add':
                if (isUndo) {
                    const index = this.entities.findIndex(e => 
                        e.x === action.entity.x && 
                        e.y === action.entity.y && 
                        e.width === action.entity.width
                    );
                    if (index > -1) {
                        this.entities.splice(index, 1);
                    }
                } else {
                    this.entities.push({ ...action.entity });
                }
                break;
            case 'delete':
                if (isUndo) {
                    this.entities.splice(action.index, 0, { ...action.entity });
                } else {
                    this.entities.splice(action.index, 1);
                }
                break;
            case 'update':
                const entity = this.entities.find(e => e === action.entity);
                if (entity) {
                    Object.assign(entity, isUndo ? action.oldState : action.newState);
                }
                break;
        }
    }

    clear() {
        this.entities = [];
        this.selectedEntity = null;
        this.history.clear();
    }

    toJSON() {
        return {
            entities: this.entities,
            settings: this.levelSettings
        };
    }

    fromJSON(data) {
        this.entities = data.entities || [];
        this.levelSettings = data.settings || this.levelSettings;
        this.selectedEntity = null;
        this.history.clear();
    }
}