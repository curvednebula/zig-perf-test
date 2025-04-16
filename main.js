const numObjects = 100_000;
const numRepeats = 10_000;

function main() {
    let start = Date.now();
    const objects = Array(numObjects);

    for (let i = 0; i < numObjects; i++) {
        objects[i] = {
            x: 0,
            y: 0
        };
    }
    const creationTime = Date.now() - start;

    start = Date.now();

    for (let j = 0; j < numRepeats; j++) {
        for (let i = 0; i < numObjects; i++) {
            const obj = objects[i];
            obj.x = i * 5; //Math.cos(i) * 5;
            obj.y = i * 5; //Math.sin(i) * 5;
        }
    }
    const updateTime = Date.now() - start;

    console.log(`JS finished creation ${creationTime}ms, update ${updateTime}ms`);
}

main();
