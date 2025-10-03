import { MOVEMENT } from './movementConstants.js';

// Deep clone to avoid accidental mutation of the base constants
const baseMovement = JSON.parse(JSON.stringify(MOVEMENT));

export const CHARACTERS = {
    MADELINE: {
        name: 'Madeline',
        color: '#ff47ab', // Hot pink
        // Madeline is faster and has a more powerful dash
        movement: {
            ...baseMovement,
            GROUND_MAX_SPEED: 350,
            DASH_SPEED: 700,
            JUMP_FORCE: 520,
        },
        // Particle effect names
        particles: {
            dash: 'madeline_dash',
        }
    },
    CAROLINE: {
        name: 'Caroline',
        color: '#47ffff', // Cyan
        // Caroline is more agile with higher acceleration
        movement: {
            ...baseMovement,
            GROUND_ACCELERATION: 2000,
            AIR_ACCELERATION: 1200,
            JUMP_FORCE: 480,
        },
        particles: {
            dash: 'caroline_dash',
        }
    }
};