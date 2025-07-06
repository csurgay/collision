// Rotate a point (pt) by angle (radians)
function rotatePoint(pt, angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return {
        x: pt.x * cos - pt.y * sin,
        y: pt.x * sin + pt.y * cos
    };
}

