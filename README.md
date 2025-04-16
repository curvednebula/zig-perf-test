# Adding dependencies:

zig fetch --save=sokol git+https://github.com/floooh/sokol-zig.git

# Desktop run

zig build run --release=fast

# Web run 

zig build run -Dtarget=wasm32-emscripten
