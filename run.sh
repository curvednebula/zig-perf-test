#!/bin/sh
set -e
zig build run --release=fast
node main.js
