# Phase 5: Camera and Multi-Screen Level System

## Overview
Expand the game to support levels larger than a single screen. Implement a camera system that follows the player smoothly, and add panning controls for the map editor. Include minimaps for both gameplay and editing.

## Implementation Steps

### Step 1: Create Camera Component
Build a Camera class that tracks a target (usually the player) and manages the viewport. The camera should have position, bounds checking, and smooth following behavior. Include properties for camera speed, deadzone, and lookahead.

### Step 2: Implement Camera Following
Make the camera follow the player with smooth interpolation rather than locking directly to their position. Add a deadzone in the center of the screen where the player can move without the camera moving. Consider adding lookahead so the camera shifts slightly in the direction the player is moving.

### Step 3: Update Rendering System
Modify the renderer to use camera position when drawing. All game objects should be drawn relative to camera position. Update the coordinate system so everything works properly with camera offsets.

### Step 4: Level Bounds System
Implement level boundaries that prevent the camera from showing areas outside the playable space. The camera should stop at level edges rather than showing empty void. Update the level settings to include width and height that can be larger than screen size.

### Step 5: Editor Panning
Add panning controls to the map editor. Use middle mouse button drag, arrow keys, or WASD to move the camera around the level. Update all editor tools to work correctly with camera offset. Snap-to-grid should still function properly when camera is moved.

### Step 6: Minimap System
Create a minimap component that shows a zoomed-out view of the entire level. Show the player position, important objects, and level geometry. The minimap should update in realtime. Make it toggleable and position it in a corner of the screen.

### Step 7: Editor Minimap
Add a similar minimap to the editor that shows all placed entities and the current camera viewport. Clicking on the minimap should move the camera to that position. This makes navigating large levels much easier.

### Step 8: Coordinate System Utilities
Create helper functions for converting between screen space, world space, and camera space. These utilities will be essential for mouse input, particle effects, and any position-based logic.

## Notes
Camera feel is crucial for platformers. It should be smooth but responsive. Avoid camera that feels like it's chasing the player or camera that's too loose. Test extensively with actual gameplay. The minimap should be informative but not distracting. Consider different zoom levels for different sized levels.

