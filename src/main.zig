const std = @import("std");
const math = std.math;
const mem = @import("std").heap.wasm_allocator;

const Actor = struct { x: f32, y: f32, velx: f32, vely: f32, rotation: f32 };

// JS functions
extern fn pixiInitApp(numSprites: usize) void;
extern fn pixiInitSprites(ptr: [*]const u8, len: usize) void;
extern fn pixiSetTransform(idx: u32, x: f32, y: f32, rotation: f32) void;

const NUM_SPRITES: u32 = 50_000;
var appWidth: f32 = 0.0;
var appHeight: f32 = 0.0;

var actors: []Actor = &[_]Actor{};

export fn onResize(width: f32, height: f32) void {
    appWidth = width;
    appHeight = height;
}

export fn onFrame(dt: f32) void {
    for (0..NUM_SPRITES) |i| {
        const obj = &actors[i];
        obj.x += obj.velx * dt;
        obj.y += obj.vely * dt;
        obj.rotation += 0.03 * dt;

        pixiSetTransform(i, obj.x, obj.y, obj.rotation);

        if (obj.x < 0) {
            obj.x = 0;
            obj.velx = -obj.velx;
        } else if (obj.x > appWidth) {
            obj.x = appWidth;
            obj.velx = -obj.velx;
        }

        if (obj.y < 0) {
            obj.y = 0;
            obj.vely = -obj.vely;
        } else if (obj.y > appHeight) {
            obj.y = appHeight;
            obj.vely = -obj.vely;
        }
    }
}

export fn entrypoint() void {
    var prng = std.Random.DefaultPrng.init(0);
    const rand = prng.random();

    actors = mem.alloc(Actor, NUM_SPRITES) catch return;

    for (0..NUM_SPRITES) |idx| {
        actors[idx] = Actor{ .x = 0, .y = 0, .velx = rand.float(f32) * 4 - 2, .vely = rand.float(f32) * 4 - 2, .rotation = rand.float(f32) * math.pi * 2 };
    }

    pixiInitApp(NUM_SPRITES);
}
