const decoder = new TextDecoder();

const NUM_SPRITES = 20_000;
const APP_WIDTH = window.innerWidth;
const APP_HEIGHT = window.innerHeight;

let wasmInstance;
let pixiApp;

const sprites = new Array(NUM_SPRITES);

function htmlById(id) {
    return document.getElementById(id);
}

async function pixiInitApp() {
    pixiApp = new PIXI.Application();
    await pixiApp.init({ 
        preference: 'webgpu',
        background: '#1099bb', 
        resizeTo: window,
        resolution: window.devicePixelRatio || 1, // enable hi dpi
        autoDensity: true,
    });
    document.body.appendChild(pixiApp.canvas);

    const texture = await PIXI.Assets.load("https://pixijs.io/examples/examples/assets/bunny.png");

    for (let i = 0; i < NUM_SPRITES; i++) {
        const sprite = new PIXI.Sprite({
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
        wasmInstance.exports.onFrame(time.deltaMS);

        numFrames++;
        timeSum += time.deltaMS;

        if (numFrames >= 60) {
            const fpsLabel = htmlById('fps');
            if (fpsLabel) {
                fpsLabel.textContent = `fps ${Math.round(60000/timeSum)}, num ${NUM_SPRITES}`;
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

function pixiSetRotation(idx, rotation) {
    const sprite = sprites[idx];
    if (sprite) {
        sprite.rotation = rotation;
    }
}

fetch('main.wasm')
    .then(res => res.arrayBuffer())
    .then(bytes => WebAssembly.instantiate(bytes, {
        env: {
            pixiInitApp,
            pixiInitSprites,
            pixiSetRotation
        }
    }))
    .then(obj => {
        wasmInstance = obj.instance;
        wasmInstance.exports.entrypoint();
    });
