import { Application, Assets, Sprite } from './pixi.min.mjs';

const decoder = new TextDecoder();

const APP_WIDTH = window.innerWidth;
const APP_HEIGHT = window.innerHeight;

let wasmInstance;
let pixiApp;
let sprites;

function htmlById(id) {
    return document.getElementById(id);
}

async function pixiInitApp(numSprites) {
    pixiApp = new Application();
    await pixiApp.init({ 
        preference: 'webgpu',
        background: '#1099bb', 
        resizeTo: window,
        resolution: window.devicePixelRatio || 1, // enable hi dpi
        autoDensity: true,
    });
    document.body.appendChild(pixiApp.canvas);

    const texture = await Assets.load("https://pixijs.io/examples/examples/assets/bunny.png");

    sprites = new Array(numSprites);

    for (let i = 0; i < numSprites; i++) {
        const sprite = new Sprite({
            texture,
            anchor: 0.5,
            x: Math.random() * APP_WIDTH,
            y: Math.random() * APP_HEIGHT,
            rotation: Math.random() * Math.PI * 2,
            scale: 1
        });
        sprites[i] = sprite;
        pixiApp.stage.addChild(sprite);
    }

    let numFrames = 0;
    let timeSum = 0.0;

    pixiApp.ticker.add((time) => {
        wasmInstance.exports.onFrame(time.deltaTime);

        numFrames++;
        timeSum += time.deltaMS;

        if (numFrames >= 60) {
            const fpsLabel = htmlById('fps');
            if (fpsLabel) {
                fpsLabel.textContent = `fps ${Math.round(60000/timeSum)}, sprites ${numSprites}`;
            }
            numFrames = 0;
            timeSum = 0.0;
        }
    });
}

async function pixiInitSprites(ptr, len) {
    const bytes = new Uint8Array(wasmInstance.exports.memory.buffer, ptr, len);
    const str = decoder.decode(bytes);
    console.log("pixiGetTexture:", str);
}

function pixiSetTransform(idx, x, y, rotation) {
    const sprite = sprites[idx];
    if (sprite) {
        sprite.x = x;
        sprite.y = y;
        sprite.rotation = rotation;
    }
}

function main() {
    fetch('main.wasm')
        .then(res => res.arrayBuffer())
        .then(bytes => WebAssembly.instantiate(bytes, {
            env: {
                pixiInitApp,
                pixiInitSprites,
                pixiSetTransform
            }
        }))
        .then(obj => {
            wasmInstance = obj.instance;
            wasmInstance.exports.entrypoint();
            wasmInstance.exports.onResize(APP_WIDTH, APP_HEIGHT);
        });
}

main();
