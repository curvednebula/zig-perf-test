# Run test

```
./run.sh
```

or

```
zig build run --release=fast
node main.js
```

# WASM builds

zig build-exe src/main.zig -target wasm32-freestanding -fno-entry -O ReleaseFast --export=main

## With binding to browser API

zig build -Dtarget=wasm32-emscripten --sysroot /d/sdk/emsdk/upstream/emscripten

