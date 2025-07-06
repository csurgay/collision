// Mouse move: handle dragging, resizing, rotating, or pointer feedback
canvas.addEventListener('mousemove', (e) => {
    const rectCanvas = canvas.getBoundingClientRect();
    const mx = e.clientX - rectCanvas.left;
    const my = e.clientY - rectCanvas.top;

    if (resizing && activeRectIdx !== null && activeHandle !== null) {
        // --- Handle resizing ---
        const rect = rects[activeRectIdx];
        const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
        const cos = Math.cos(-rect.angle), sin = Math.sin(-rect.angle);
        const dx = mx - cx, dy = my - cy;
        const lx = dx * cos - dy * sin;
        const ly = dx * sin + dy * cos;
        // Get current rectangle corners in local space
        let x0 = -rect.w / 2, y0 = -rect.h / 2, x1 = rect.w / 2, y1 = rect.h / 2;
        // Adjust the corner being dragged
        switch (activeHandle) {
            case 0: x0 = lx; y0 = ly; break;
            case 1: x1 = lx; y0 = ly; break;
            case 2: x1 = lx; y1 = ly; break;
            case 3: x0 = lx; y1 = ly; break;
        }
        let newW = Math.max(x1 - x0, handleSize * 2);
        let newH = Math.max(y1 - y0, handleSize * 2);

        // Simulate new rectangle for collision check
        const newRect = {
            x: 0, y: 0, w: newW, h: newH, angle: rect.angle
        };
        // Compute new center in world space
        const newCx = cx + ((x0 + x1) / 2) * Math.cos(rect.angle) - ((y0 + y1) / 2) * Math.sin(rect.angle);
        const newCy = cy + ((x0 + x1) / 2) * Math.sin(rect.angle) + ((y0 + y1) / 2) * Math.cos(rect.angle);
        newRect.x = newCx - newW / 2;
        newRect.y = newCy - newH / 2;

        // Use CCD to avoid collisions during resize
        interpolateAndMoveRect(
            rect,
            { x: rect.x, y: rect.y, w: rect.w, h: rect.h, angle: rect.angle },
            { x: newRect.x, y: newRect.y, w: newW, h: newH, angle: rect.angle },
            (lastValid) => {
                rect.x = lastValid.x;
                rect.y = lastValid.y;
                rect.w = lastValid.w;
                rect.h = lastValid.h;
            },
            activeRectIdx
        );
        draw();
    } else if (dragging && activeRectIdx !== null) {
        // --- Handle dragging ---
        const rect = rects[activeRectIdx];
        const cx = mx, cy = my;
        const cos = Math.cos(rect.angle), sin = Math.sin(rect.angle);
        const localX = dragOffset.x, localY = dragOffset.y;
        const dx = localX * cos - localY * sin;
        const dy = localX * sin + localY * cos;
        // Simulate new rectangle for collision check
        const newRect = {
            x: cx - dx - rect.w / 2,
            y: cy - dy - rect.h / 2,
            w: rect.w,
            h: rect.h,
            angle: rect.angle
        };
        // Use CCD to avoid collisions during drag
        interpolateAndMoveRect(
            rect,
            { x: rect.x, y: rect.y, w: rect.w, h: rect.h, angle: rect.angle },
            { x: newRect.x, y: newRect.y, w: rect.w, h: rect.h, angle: rect.angle },
            (lastValid) => {
                rect.x = lastValid.x;
                rect.y = lastValid.y;
            },
            activeRectIdx
        );
        draw();
    } else if (rotating && activeRectIdx !== null) {
        // --- Handle rotating ---
        const rect = rects[activeRectIdx];
        const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
        // Compute angle between start and current mouse position
        const angle1 = Math.atan2(rotateStartMouse.y, rotateStartMouse.x);
        const angle2 = Math.atan2(my - cy, mx - cx);
        const newAngle = rotateStartAngle + (angle2 - angle1);
        // Simulate new rectangle for collision check
        interpolateAndMoveRect(
            rect,
            { x: rect.x, y: rect.y, w: rect.w, h: rect.h, angle: rect.angle },
            { x: rect.x, y: rect.y, w: rect.w, h: rect.h, angle: newAngle },
            (lastValid) => {
                rect.angle = lastValid.angle;
            },
            activeRectIdx
        );
        draw();
    } else {
        // --- Pointer feedback: change cursor based on what's under the mouse ---
        let found = false;
        for (let i = rects.length - 1; i >= 0; i--) {
            const handle = pointInHandle(mx, my, rects[i]);
            if (handle !== null) {
                if (handle === 4) {
                    canvas.style.cursor = 'crosshair'; // Rotation handle
                } else {
                    canvas.style.cursor = 'pointer'; // Resize handle
                }
                found = true;
                break;
            } else if (pointInRect(mx, my, rects[i])) {
                canvas.style.cursor = 'move'; // Drag
                found = true;
                break;
            }
        }
        if (!found) {
            canvas.style.cursor = 'default'; // Default cursor
        }
    }
});
