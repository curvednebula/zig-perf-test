set -e

zig build-exe src/main.zig -target wasm32-freestanding -fno-entry -O ReleaseFast \
    --export=entrypoint \
    --export=onFrame

serve .
