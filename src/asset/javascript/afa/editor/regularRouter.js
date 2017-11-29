

function throwIfMissing() {
    throw new Error('Missing parameter');
}

function getSourceNormal(line = throwIfMissing()) {
    let source = line.getStartPoint();

    if (line.model.sourceNode) return getDirection(line.model.sourceNode.get('bounds'), source);

    let target = line.getEndPoint(), offsetX = source.x - target.x, offsetY = source.y - target.y;

    return Math.abs(offsetX) > Math.abs(offsetY) ? {x: offsetX/Math.max(1, Math.abs(offsetX)), y: 0} : {x: 0, y: offsetY/Math.max(1, Math.abs(offsetY))};
}

function getTargetNormal(line = throwIfMissing()) {
    let target = line.getEndPoint();

    if (line.model.targetNode) return getDirection(line.model.targetNode.get('bounds'), target);

    let source = line.getStartPoint(), offsetX = target.x - source.x, offsetY = target.y - source.y;

    return Math.abs(offsetX) > Math.abs(offsetY) ? {x: offsetX/Math.max(1, Math.abs(offsetX)), y: 0} : {x: 0, y: offsetY/Math.max(1, Math.abs(offsetY))};
}

const minGap = 5;

const getVector = function(p1, p2) {
    let {abs, max} = Math;
    return {x: (p1.x - p2.x)/max(1, abs(p1.x - p2.x)),
        y: (p1.y - p2.y)/max(1, abs(p1.y - p2.y))};
};

const dotProduct = function(r1, r2) {
    return r1.x*r2.x + r1.y*r2.y;
};

const similarity = function (point, direction) {
    if (direction.x != 0) return point.x +  minGap*direction.x/Math.abs(direction.x);
    else return point.y + minGap*direction.y/Math.abs(direction.y)
}


export default function route(line) {
    if (line.points === null || line.points.length < 2) {
        return null;
    }

    let source = line.getStartPoint(),
        target = line.getEndPoint(),
        sourceNormal = getSourceNormal(line),
        targetNormal = getTargetNormal(line),
        direction = getVector(target, source),
        average = {x: (source.x + target.x)/2 , y: (source.y + target.y)/2},
        horizontal = sourceNormal.y == 0,
        result = [], i;

    result.push(horizontal ? source.x : source.y);
    horizontal = !horizontal;

    if (dotProduct(sourceNormal, targetNormal) == 0) {
        if (dotProduct(sourceNormal, direction) >= 0 &&
            dotProduct(targetNormal, direction) <= 0) {
            //0
        } else {

            if (direction(sourceNormal, direction) < 0) {
                i = similarity(source, sourceNormal);
            } else {
                i = horizontal ? average.y : average.x;
            }

            result.push(i);
            horizontal = !horizontal;

            if (dotProduct(targetNormal, direction) > 0) {
                i = similarity(target, targetNormal);
            } else {
                i = horizontal ? average.y : average.x;
            }

            result.push(i);
            horizontal = !horizontal;

        }
    } else {

        if (dotProduct(sourceNormal, targetNormal) > 0) {

            if (dotProduct(sourceNormal, direction) >= 0) {
                i = similarity(source, sourceNormal);
            } else {
                i = similarity(target, targetNormal);
            }

            result.push(i);
            horizontal = !horizontal;
        } else {
            if (dotProduct(sourceNormal, direction) < 0) {
                i = similarity(source, sourceNormal);
                result.push(i);
                horizontal = !horizontal;
            }

            i = horizontal ? average.y : average.x;
            result.push(i);
            horizontal = !horizontal;

            if (dotProduct(sourceNormal, direction) < 0) {
                i = similarity(target, targetNormal);

                result.push(i);
                horizontal = !horizontal;
            }
        }
    }

    result.push(horizontal ? target.y : target.x);

    //process
}