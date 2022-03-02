import { find_alpha_z_value, TestSide, one_sample_mean_test } from "$lib/graphing_utils";
var WIDTH = 0;
var HEIGHT = 0;

// Returns the right boundary of the logical viewport:
function MaxX() {
    return 4;
}

// Returns the left boundary of the logical viewport:
function MinX() {
    return -4;
}

// Returns the top boundary of the logical viewport:
function MaxY() {
    return 0.45;
}

// Returns the bottom boundary of the logical viewport:
function MinY() {
    return 0;
}

// Returns the physical x-coordinate of a logical x-coordinate:
function XC(x) {
    return (x - MinX()) / (MaxX() - MinX()) * WIDTH;
}

// Returns the physical y-coordinate of a logical y-coordinate:
function YC(y) {
    return HEIGHT - (y - MinY()) / (MaxY() - MinY()) * HEIGHT;
}

// Returns the distance between ticks on the X axis:
function XTickDelta() {
    return 1;
}

// Returns the distance between ticks on the Y axis:
function YTickDelta() {
    return 1;
}

// DrawAxes draws the X ad Y axes, with tick marks.
function drawAxes(ctx) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    // +X axis
    ctx.beginPath();
    ctx.moveTo(XC(0), YC(0));
    ctx.lineTo(XC(MaxX()), YC(0));
    ctx.stroke();

    // -X axis
    ctx.beginPath();
    ctx.moveTo(XC(0), YC(0));
    ctx.lineTo(XC(MinX()), YC(0));
    ctx.stroke();

    // X tick marks
    var delta = XTickDelta();
    for (var i = 1; (i * delta) < MaxX(); ++i) {
        ctx.beginPath();
        ctx.moveTo(XC(i * delta), YC(0) - 5);
        ctx.lineTo(XC(i * delta), YC(0) + 5);
        ctx.stroke();
    }

    var delta = XTickDelta();
    for (var i = 1; (i * delta) > MinX(); --i) {
        ctx.beginPath();
        ctx.moveTo(XC(i * delta), YC(0) - 5);
        ctx.lineTo(XC(i * delta), YC(0) + 5);
        ctx.stroke();
    }
    ctx.restore();
}

// RenderFunction(f) renders the input funtion f on the canvas.
function renderFunction(f, ctx) {
    let points = getPointsOnNormalCurve(MinX(), MaxX());
    ctx.beginPath();
    ctx.moveTo(XC(points[0][0]), YC(points[0][1]));
    for (var i = 1; i < points.length - 2; i++) {
        var xc = (XC(points[i][0]) + XC(points[i + 1][0])) / 2;
        var yc = (YC(points[i][1]) + YC(points[i + 1][1])) / 2;
        ctx.quadraticCurveTo(XC(points[i][0]), YC(points[i][1]), xc, yc);
    }
    ctx.quadraticCurveTo(XC(points[i][0]), YC(points[i][1]), XC(points[i + 1][0]), YC(points[i + 1][1]));
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'grey';
    ctx.stroke();
}

function fillAlphaAreas(ctx, alpha, test_side) {
    var alpha_z_val;
    if( test_side == TestSide.TwoSided) {
        alpha_z_val = find_alpha_z_value(alpha / 2);
    }
    else {
        alpha_z_val = find_alpha_z_value(alpha);
    }
    if (test_side == TestSide.Lower || test_side == TestSide.TwoSided) {
        fillAreaOnNormalCurve(ctx, MinX(), alpha_z_val);
    }
    if (test_side == TestSide.Upper || test_side == TestSide.TwoSided) {
        const x_pos = -alpha_z_val;
        fillAreaOnNormalCurve(ctx, x_pos, MaxX());
    }
}

function drawLineOnNormalCurve(ctx, x_pos, color) {
    // clamp the value of x_pos to MinX() and MaxX()
    // TODO: find a better way to visualize then the measured value is off the graph
    x_pos = Math.max(Math.min(x_pos, MaxX()), MinX());
    var normal_curve = function (x) { return 1 / (1 * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * (x ** 2)); };
    const y_max = Math.max(normal_curve(x_pos), 0.4);
    ctx.beginPath();
    ctx.moveTo(XC(x_pos), YC(0));
    ctx.lineTo(XC(x_pos), YC(y_max));
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}


function getPointsOnNormalCurve(x_start, x_finish) {
    var normal_curve = function (x) { return 1 / (1 * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * (x ** 2)); };
    var points = [];
    const xstep = (MaxX() - MinX()) / WIDTH;
    for (var x = x_start; x <= x_finish; x += xstep) {
        var point = [x, normal_curve(x)];
        points.push(point);
    }
    return points;
}

function fillAreaOnNormalCurve(ctx, x_start, x_finish) {
    var normal_curve = function (x) { return 1 / (1 * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * (x ** 2)); };
    const y_start = normal_curve(x_start);
    let region = new Path2D();
    region.moveTo(XC(x_start), YC(0));
    region.lineTo(XC(x_start), YC(y_start));
    let points = getPointsOnNormalCurve(x_start, x_finish);
    ctx.moveTo(XC(points[0][0]), YC(points[0][1]));
    for (var i = 1; i < points.length - 2; i++) {
        var xc = (XC(points[i][0]) + XC(points[i + 1][0])) / 2;
        var yc = (YC(points[i][1]) + YC(points[i + 1][1])) / 2;
        region.quadraticCurveTo(XC(points[i][0]), YC(points[i][1]), xc, yc);
    }
    region.quadraticCurveTo(XC(points[i][0]), YC(points[i][1]), XC(points[i + 1][0]), YC(points[i + 1][1]));
    region.lineTo(XC(x_finish), YC(0));
    region.lineTo(XC(x_finish), YC(0));
    region.closePath();

    var grad = ctx.createRadialGradient(300, 100, 0, 300, 100, 316.23);

    grad.addColorStop(0, 'rgba(0, 209, 255, 1)');
    grad.addColorStop(1, 'rgba(231, 252, 255, 1)');

    ctx.fillStyle = grad;

    ctx.fill(region);
}

// Clears the canvas, draws the axes and graphs the function F.
export function Draw(ctx, alpha, test_side, alternate_hypothesis, null_hypothesis, sigma, n) {
    HEIGHT = ctx.canvas.height;
    WIDTH = ctx.canvas.width;
    var normal_curve = function (x) { return 1 / (1 * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * (x ** 2)); };
    // Set up the canvas:
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Draw:
    fillAlphaAreas(ctx, alpha, test_side);
    renderFunction(normal_curve, ctx);
    // draw the predicted mean on the normal curve
    drawLineOnNormalCurve(ctx, one_sample_mean_test(alternate_hypothesis, null_hypothesis, sigma, n), "red");
    drawAxes(ctx);

}