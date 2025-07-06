// Get the axis-aligned bounding box of a rotated rectangle
function getBoundingBox(r) {
    // Compute the four corners of the rotated rectangle
    const hw = r.w / 2, hh = r.h / 2;
    const cx = r.x + hw, cy = r.y + hh;
    const corners = [
        { x: -hw, y: -hh },
        { x: hw, y: -hh },
        { x: hw, y: hh },
        { x: -hw, y: hh }
    ].map(pt => {
        const rotated = rotatePoint(pt, r.angle);
        return { x: rotated.x + cx, y: rotated.y + cy };
    });
    // Find min/max X/Y among corners
    let minX = corners[0].x, maxX = corners[0].x;
    let minY = corners[0].y, maxY = corners[0].y;
    for (let i = 1; i < 4; i++) {
        minX = Math.min(minX, corners[i].x);
        maxX = Math.max(maxX, corners[i].x);
        minY = Math.min(minY, corners[i].y);
        maxY = Math.max(maxY, corners[i].y);
    }
    return { minX, minY, maxX, maxY };
}

// Check if two axis-aligned bounding boxes overlap
function boundingBoxesOverlap(a, b) {
    return !(a.maxX < b.minX || a.minX > b.maxX || a.maxY < b.minY || a.minY > b.maxY);
}

