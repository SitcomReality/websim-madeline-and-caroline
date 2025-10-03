export default class LevelSerializer {
    serialize(editorState) {
        return JSON.stringify(editorState.toJSON(), null, 2);
    }

    deserialize(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error('Failed to deserialize level data:', e);
            return null;
        }
    }
}

