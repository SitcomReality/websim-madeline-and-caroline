// Movement tuning constants
export const MOVEMENT = {
    // Ground movement
    GROUND_ACCELERATION: 1500,
    GROUND_MAX_SPEED: 300,
    GROUND_FRICTION: 1200,

    // Air movement
    AIR_ACCELERATION: 1000,
    AIR_MAX_SPEED: 300,
    AIR_RESISTANCE: 200,

    // Jump
    JUMP_FORCE: 500,
    JUMP_HOLD_GRAVITY_MULTIPLIER: 0.5,
    JUMP_RELEASE_GRAVITY_MULTIPLIER: 1.5,
    MAX_JUMP_HOLD_TIME: 0.2,

    // Dash
    DASH_SPEED: 600,
    DASH_DURATION: 0.15,
    DASH_COOLDOWN: 0.3,
    DOUBLE_TAP_WINDOW: 0.25,

    // Slide
    SLIDE_FRICTION_MULTIPLIER: 0.3,
    SLIDE_MIN_SPEED: 50,

    // Liquid friction modifiers (for future implementation)
    FRICTION_MODIFIERS: {
        DRY: 1.0,
        GASOLINE_THIN: 0.3,
        GASOLINE_DEEP: 2.0,
        WATER_SHALLOW: 1.5,
        WATER_DEEP: 3.0
    }
};