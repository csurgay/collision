// Compute the positions of the handles for a rectangle
function getHandles(r) {
    const hw = r.w / 2, hh = r.h / 2;
    const cx = r.x + hw, cy = r.y + hh;
    // Handles are at the inside corners, inset by half handle size
    const inset = handleSize / 2;
    const corners = [
        { x: -hw + inset, y: -hh + inset },
        { x: hw - inset, y: -hh + inset },
        { x: hw - inset, y: hh - inset },
        { x: -hw + inset, y: hh - inset }
    ].map(pt => {
        // Rotate each corner by the rectangle's angle
        const rotated = rotatePoint(pt, r.angle);
        return {
            x: rotated.x + cx,
            y: rotated.y + cy,
            angle: r.angle // Store angle for handle orientation
        };
    });
    // Rotation handle is above the top edge, centered
    const midTop = rotatePoint({ x: 0, y: -hh + 10 }, r.angle);
    return [
        corners[0],
        corners[1],
        corners[2], // Order matches corners
        corners[3],
        { x: cx + midTop.x, y: cy + midTop.y, angle: 0 }
    ];
}

