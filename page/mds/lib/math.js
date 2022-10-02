//Given a line segment p1,p2, return the length of the line
Math.getLineLength = function (p1, p2) {
    return Math.sqrt(Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[0] - p2[0], 2));
}

//Given two line segments p1,p2 and q1,q2, where p1=[x1, y1] and p2=[x2, y2], etc.,
//Returns true if the line segments intersect; false otherwise
Math.segmentsIntersect = function (p1, p2, q1, q2) {
    var r = [p2[0] - p1[0], p2[1] - p1[1]], s = [q2[0] - q1[0], q2[1] - q1[1]];

    var rXs = Math.crossProduct2D(r, s);
    if (rXs === 0) { //lines are parallel
        if (Math.crossProduct2D([q1[0] - p1[0], q1[1] - [1]], r) === 0) { //collinear
            return true;
        }
        return false;
    }
    var t = Math.crossProduct2D([q1[0] - p1[0], q1[1] - p1[1]], s) / rXs;
    var u = Math.crossProduct2D([q1[0] - p1[0], q1[1] - p1[1]], r) / rXs;
    if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
        return true;
    }
    return false;
}

//Given a line p1,p2, return the angle in radians that the angle is rotated about p1
//Returns 0 if the line has 0-length
Math.getLineAngle = function (p1, p2) {
    var c = Math.getLineLength(p1, p2);
    var theta = (c != 0 ? Math.asin(Math.abs(p1[1] - p2[1]) / c) : 0);

    if (p2[0] <= p1[0] && p2[1] <= p1[1]) {
        theta = theta - Math.PI;
        theta = theta * -1;
    } //quad 2
    else if (p2[0] <= p1[0] && p2[1] >= p1[1]) {
        theta = theta - Math.PI;
    } //quad 3
    else if (p2[0] >= p1[0] && p2[1] >= p1[1]) {
        theta = theta * -1;
    } //quad 4

    return theta;
}

//Given an origin [Ox, Oy] and a point [Px, Py], get the point rotated theta radians about the origin
Math.getRotatedPoint = function (origin, point, theta) {
    theta = theta * -1; //invert angle because working with inverted Y axis
    return [
        Math.cos(theta) * (point[0] - origin[0]) - Math.sin(theta) * (point[1] - origin[1]) + origin[0], origin[1] +
        Math.sin(theta) * (point[0] - origin[0]) + Math.cos(theta) * (point[1] - origin[1])
    ];
};

//helper
Math.crossProduct2D = function (v, w) {
    return v[0] * w[1] - v[1] * w[0];
}

Math.inchesToString = function (arg, denominator, reduce) {
    if (reduce === undefined)
        reduce = true;

    var number = Math.round(arg * denominator),
        integer = Math.floor(number / denominator);
    number %= denominator;

    if (!number) {
        return "" + integer;
    }

    if (reduce) {
        // Use Euclid's algorithm to find the GCD.
        var a = number < 0 ? -number : number,
            b = denominator,
            t;
        while (b) {
            t = b;
            b = a % t;
            a = t;
        }

        number /= a;
        denominator /= a;
    }

    if (integer) {
        // Suppress minus sign in numerator; keep it only in the integer part.
        if (number < 0) {
            number *= -1;
        }
        return "" + integer + " " + number + "/" + denominator;
    }

    return "" + number + "/" + denominator;
};