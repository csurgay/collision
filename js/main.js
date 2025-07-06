// Get canvas and context
const canvas = document.getElementById('collision');
const ctx = canvas.getContext('2d');
const handleSize = 16; // Size of the resize/rotate handles

// State variables for interaction
let dragging = false; // True if dragging a rectangle
let dragOffset = { x: 0, y: 0 }; // Offset from center when dragging
let resizing = false; // True if resizing a rectangle
let activeHandle = null; // Which handle is active (0-3: corners, 4: rotate)
let rotating = false; // True if rotating a rectangle
let rotateStartAngle = 0; // Initial angle at start of rotation
let rotateStartMouse = { x: 0, y: 0 }; // Mouse position at start of rotation (relative to center)
let activeRectIdx = null; // Index of the active rectangle

// --- Multiple rectangles support with initial separation ---
const NUM_RECTS = 7; // Number of rectangles
let rects = []; // Array of rectangles
const maxTries = 1000; // Max attempts to place a rectangle without overlap

