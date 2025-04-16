const std = @import("std");

const num_objects = 100_000;
const num_repeats = 100_000;

const Point = struct {
    x: f64,
    y: f64,
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const start_creation = std.time.milliTimestamp();

    var objects = try allocator.alloc(Point, num_objects);

    for (0..objects.len) |i| {
        objects[i] = Point{ .x = 0, .y = 0 };
    }

    const creation_time_ms = (std.time.milliTimestamp() - start_creation);
    const start_update = std.time.milliTimestamp();

    for (0..num_repeats) |_| {
        for (0..objects.len) |i| {
            var obj = &objects[i];
            obj.x = @floatFromInt(i * 5);
            obj.y = @floatFromInt(i * 5);
        }
    }

    const update_time_ms = (std.time.milliTimestamp() - start_update);
    std.debug.print("Zig finished creation {}ms, update {}ms\n", .{ creation_time_ms, update_time_ms });

    // Cleanup
    // for (objects) |obj| allocator.destroy(obj);
    allocator.free(objects);
}
