const Point = struct { x: f32, y: f32, rotation: f32 };

// JS functions
extern fn pixiInitApp(numSprites: usize) void;
extern fn pixiInitSprites(ptr: [*]const u8, len: usize) void;
extern fn pixiSetRotation(idx: u32, rotation: f32) void;

const NUM_SPRITES = 20_000;

var objects: [NUM_SPRITES]Point = undefined;

export fn onFrame(deltaTime: f32) void {
    for (0..NUM_SPRITES) |idx| {
        const obj = &objects[idx];
        obj.rotation += 0.003 * deltaTime;
        pixiSetRotation(idx, obj.rotation);
    }
}

export fn entrypoint() void {
    for (0..NUM_SPRITES) |idx| {
        objects[idx] = Point{ .x = 0, .y = 0, .rotation = 0 };
    }

    pixiInitApp(NUM_SPRITES);
}
