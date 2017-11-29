

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


export default function route(line) {

    let sourceNormal = getSourceNormal(line),
        targetNormal = getTargetNormal(line),
        vector = getVector(line.getEndPoint(), line.getStartPoint()),
        result;

    //以sourceNormal为基准
    let dot = dotProduct(sourceNormal, targetNormal);

    //same
    if (dot == 1) {

        

    } else if (dot == 0) {

    } else {

    }
}