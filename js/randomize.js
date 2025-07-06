// Place rectangles randomly, avoiding overlap
for (let i = 0; i < NUM_RECTS; i++) {
    let placed = false, tries = 0;
    while (!placed && tries < maxTries) {
        tries++;
        let w = 180, h = 120;
        let angle = Math.random() * Math.PI * 2;
        let x = Math.random() * (canvas.width - w - 40) + 20;
        let y = Math.random() * (canvas.height - h - 40) + 20;
        let rect = { x, y, w, h, angle };
        let bbox = getBoundingBox(rect);
        let overlap = false;
        // Check overlap with existing rectangles
        for (let j = 0; j < rects.length; j++) {
            let otherBbox = getBoundingBox(rects[j]);
            if (boundingBoxesOverlap(bbox, otherBbox)) {
                overlap = true;
                break;
            }
        }
        if (!overlap) {
            rects.push(rect);
            placed = true;
        }
    }
    if (!placed) {
        // Fallback: place without rotation and with more spacing
        let w = 180, h = 120;
        let x = 40 + i * (w + 40);
        let y = 40 + i * (h + 40);
        rects.push({ x, y, w, h, angle: 0 });
    }
}

