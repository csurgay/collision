// --- Prevent collision on drag/resize/rotate ---

// Check if a test rectangle would collide with any other rectangle (except ignoreIdx)
function wouldCollide(testRect, ignoreIdx) {
    const testBox = getBoundingBox(testRect);
    for (let i = 0; i < rects.length; i++) {
        if (i === ignoreIdx) continue;
        const otherBox = getBoundingBox(rects[i]);
        if (boundingBoxesOverlap(testBox, otherBox)) return true;
    }
    return false;
}

// Helper for continuous collision detection (CCD) during movement
function interpolateAndMoveRect(rect, from, to, updateFn, ignoreIdx) {
    const steps = 20; // Number of interpolation steps
    let lastValid = { ...from };
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const interp = {};
        for (const key in from) {
            interp[key] = from[key] + (to[key] - from[key]) * t;
        }
        if (!wouldCollide(interp, ignoreIdx)) {
            lastValid = { ...interp };
        } else {
            break; // Stop at first collision
        }
    }
    updateFn(lastValid); // Apply the last valid position/size/angle
}

