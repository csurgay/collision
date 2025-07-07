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


function interpolateAndMoveRect(rect, from, to, updateFn, ignoreIdx) {
    // Choose interpolation method based on distance
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy); // Calculate distance between from and to
    if (distance < 0) { // always binary
        interpolateAndMoveRectLinear(rect, from, to, updateFn, ignoreIdx);
    } else {
        interpolateAndMoveRectBinary(rect, from, to, updateFn, ignoreIdx);
    }
}

// Linear search
function interpolateAndMoveRectLinear(rect, from, to, updateFn, ignoreIdx) {
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

// Binary search
function interpolateAndMoveRectBinary(rect, from, to, updateFn, ignoreIdx) {
    // Helper to compute distance between from and to
    function distance(a, b) {
        let sum = 0;
        for (const key in a) {
            sum += Math.pow(b[key] - a[key], 2);
        }
        return Math.sqrt(sum);
    }

    let lo = 0;
    let hi = 1;
    let best = { ...from };

    while ((hi - lo) > 0.001) { // Stop when step is less than ~1 pixel
        const mid = (lo + hi) / 2;
        const interp = {};
        for (const key in from) {
            interp[key] = from[key] + (to[key] - from[key]) * mid;
        }
        if (!wouldCollide(interp, ignoreIdx)) {
            best = { ...interp };
            lo = mid;
        } else {
            hi = mid;
        }
        // Optional: break if the move is less than 1 pixel
        if (distance(from, interp) < 0.1) break;
    }
    updateFn(best);
}
