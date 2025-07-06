// Check if mouse is inside any handle of a rectangle
function pointInHandle(mx, my, rect) {
    const handles = getHandles(rect);
    for (let i = 0; i < 4; i++) {
        const h = handles[i];
        // Transform mouse point into handle's local (rotated) space
        const dx = mx - h.x, dy = my - h.y;
        const cos = Math.cos(-h.angle), sin = Math.sin(-h.angle);
        const lx = dx * cos - dy * sin;
        const ly = dx * sin + dy * cos;
        if (
            lx >= -handleSize / 2 &&
            lx <= handleSize / 2 &&
            ly >= -handleSize / 2 &&
            ly <= handleSize / 2
        ) {
            return i; // Return handle index
        }
    }
    // Check rotation handle (circle)
    const r = handles[4];
    const dist = Math.hypot(mx - r.x, my - r.y);
    if (dist <= handleSize * 1.5) return 4;
    return null;
}

// Check if mouse is inside the rectangle (rotated)
function pointInRect(mx, my, rect) {
    const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
    const dx = mx - cx, dy = my - cy;
    const cos = Math.cos(-rect.angle), sin = Math.sin(-rect.angle);
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;
    return (
        lx >= -rect.w / 2 && lx <= rect.w / 2 &&
        ly >= -rect.h / 2 && ly <= rect.h / 2
    );
}

// Mouse down: check if user clicked a handle, rotation handle, or rectangle
canvas.addEventListener('mousedown', (e) => {
    const rectCanvas = canvas.getBoundingClientRect();
    const mx = e.clientX - rectCanvas.left;
    const my = e.clientY - rectCanvas.top;

    // Find topmost handle/rotation/rect under mouse
    activeRectIdx = null;
    for (let i = rects.length - 1; i >= 0; i--) {
        const handle = pointInHandle(mx, my, rects[i]);
        if (handle !== null) {
            activeRectIdx = i;
            if (handle === 4) {
                // Start rotating
                rotating = true;
                const rect = rects[activeRectIdx];
                const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
                rotateStartAngle = rect.angle;
                rotateStartMouse = { x: mx - cx, y: my - cy };
            } else {
                // Start resizing
                resizing = true;
                activeHandle = handle;
            }
            break;
        } else if (pointInRect(mx, my, rects[i])) {
            // Start dragging
            activeRectIdx = i;
            dragging = true;
            const rect = rects[activeRectIdx];
            const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
            const dx = mx - cx, dy = my - cy;
            const cos = Math.cos(-rect.angle), sin = Math.sin(-rect.angle);
            dragOffset.x = dx * cos - dy * sin;
            dragOffset.y = dx * sin + dy * cos;
            break;
        }
    }
    draw();
});

// Mouse up: clear all interaction states
canvas.addEventListener('mouseup', () => {
    dragging = false;
    resizing = false;
    rotating = false;
    activeHandle = null;
    activeRectIdx = null;
});

// Mouse leaves canvas: clear all interaction states
canvas.addEventListener('mouseleave', () => {
    dragging = false;
    resizing = false;
    rotating = false;
    activeHandle = null;
    activeRectIdx = null;
});
