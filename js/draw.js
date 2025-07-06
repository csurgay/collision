// Draw the bounding box of a rectangle (dashed)
function drawBoundingBox(r) {
    const bbox = getBoundingBox(r);
    ctx.save();
    ctx.strokeStyle = '#888';
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1;
    ctx.strokeRect(bbox.minX, bbox.minY, bbox.maxX - bbox.minX, bbox.maxY - bbox.minY);
    ctx.setLineDash([]);
    ctx.restore();
}

// Draw all rectangles, their bounding boxes, and handles
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rects.forEach((rect, idx) => {
        drawBoundingBox(rect);

        // Draw the rectangle (rotated)
        ctx.save();
        ctx.translate(rect.x + rect.w / 2, rect.y + rect.h / 2);
        ctx.rotate(rect.angle);
        ctx.strokeStyle = '#0074D9';
        ctx.lineWidth = 2;
        ctx.strokeRect(-rect.w / 2, -rect.h / 2, rect.w, rect.h);
        ctx.restore();

        // Draw handles as small wireframe squares at the corners
        ctx.strokeStyle = '#0074D9';
        ctx.lineWidth = 2;
        const handles = getHandles(rect);
        for (let i = 0; i < 4; i++) {
            const h = handles[i];
            ctx.save();
            ctx.translate(h.x, h.y);
            ctx.rotate(h.angle);
            ctx.beginPath();
            ctx.rect(-handleSize / 2, -handleSize / 2, handleSize, handleSize);
            ctx.stroke();
            ctx.restore();
        }
        // Draw rotation handle
        const rot = handles[4];
        ctx.beginPath();
        ctx.arc(rot.x, rot.y, handleSize / 1.7, 0, Math.PI * 2);
        ctx.strokeStyle = '#0074D9';
        ctx.stroke();
    });
}

