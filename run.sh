#!/bin/sh

zig build run --release=fast
node main.js
