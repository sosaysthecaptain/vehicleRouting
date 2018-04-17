// Functions pertaining to geometry and routing

function findFurthestFromPoint(referencePointIndex) {
    /*
    Finds point the furthest from the given point index. Excludes depot in search
    */

    // for each point, add distance to distanceArray
    let distanceArray = [0];            // we start counting from index 1, depot gets zero
    let referencePoint = points[referencePointIndex];

    for (var i = 1; i < points.length; i++) {
        
        let pointAtIndex = points[i];
        let distance = dist(pointAtIndex.vector.x, pointAtIndex.vector.y, referencePoint.vector.x, referencePoint.vector.y);
        distanceArray.push(distance);
    }

    // find biggest item in this array, return its index
    var runningLargest = 0;
    var runningLargestIndex = 0;

    for (var i = 0; i < distanceArray.length; i++) {
        if (distanceArray[i] > runningLargest) {
            runningLargest = distanceArray[i];
            runningLargestIndex = i;
        }
    }

    //highlightPoint(runningLargestIndex);
    return runningLargestIndex;
}

function addSeedPoints() {
    /*
    First function of route generation. Finds the furthest point from the depot, adds it to routeA, then finds the furthest point from that and adds it to routeB.
    */

    // since this is the initial thing to do, reset routes
    resetRoutes();

    // find seed indices
    let routeASeedIndex = findFurthestFromPoint(0);
    let routeBSeedIndex = findFurthestFromPoint(routeASeedIndex);

    // add them to their routes
    //routeA.splice(1, 0, routeASeedIndex);
    //routeB.splice(1, 0, routeBSeedIndex);
    insertPointIntoRoute(routeASeedIndex, routeA, 1);
    insertPointIntoRoute(routeBSeedIndex, routeB, 1);

    drawRoutes();

}

function insertNearestPoint(route) {
    /*
    Given a route, inserts the nearest point into the position which produces the shortest possible route.

    Makes use of findPointNearestRoute() and getRouteLength()
    */

    // find the nearest point
    let nearestPointIndex = findPointNearestRoute(route);

    var bestCandidateRouteLength = Infinity;
    var bestCandidateRoute = [];
    // for position in route, construct a candidate route
    for (var i = 0; i < route.length; i++) {
        var candidateArray = route.slice();
        insertPointIntoRoute(nearestPointIndex, route);
        console.log(candidateArray);
    }
}

function findPointNearestRoute(route) {
    /*
    Returns index of unassigned point nearest one of the points on the given route.
    */
   var bestDistance = Infinity;
   var bestPointIndex = 0;

    // for point in route that isn't the depot
    for (var i = 1; i < route.length - 1; i++) {
        routePointIndex = route[i];

        // iterate through unassignedPoints, find the closest
        for (var j = 0; j < unassignedPoints.length; j++) {
            let candidatePointIndex = unassignedPoints[j];
            let distance = getDistanceBetweenPoints(routePointIndex, candidatePointIndex);
            console.log('checking points ' + routePointIndex + ' and ' + candidatePointIndex);
            console.log('  distance: ' + distance);
            if (distance < bestDistance) {
                console.log('  BEST DISTANCE');
                bestDistance = distance;
                bestPointIndex = candidatePointIndex;
            }
        }
    }

    highlightPoint(bestPointIndex);
}



// **************************************************
// MINOR/HELPER FUNCTIONS
function updateUnassignedPoints() {
    /*
    Sets unassignedPoints to be all points less those in routes.
    */

    // add all points back to unassigned
    unassignedPoints = [];
    for (var i = 0; i < points.length; i++) {
        unassignedPoints.push(points[i].index);
    }
    
    // remove routeA points from unassigned
    for (var i = 0; i < routeA.length; i++) {
        let pointIndex = routeA[i];
        removeNumberFromArray(pointIndex, unassignedPoints);
    }

    // remove routeB points from unassigned
    for (var i = 0; i < routeB.length; i++) {
        let pointIndex = routeB[i];
        removeNumberFromArray(pointIndex, unassignedPoints);
    }
}

function resetRoutes() {
    /*
    Empties routes, updates unassigned.
    */
    routeA = [0, 0];
    routeB = [0, 0];

    updateUnassignedPoints();
    drawRoutes();
}

function removeNumberFromArray(number, array) {
    /*
    If given number is in the array, this function removes it. If not, it does nothing.
    */
    let index = array.indexOf(number);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function insertPointIntoRoute(pointIndexToInsert, route, atIndex) {
    /*
    Given pointIndex, route, and index to insert at, inserts pointIndex into route. Updates unassigned, draws routes.
    */
    // check to make sure point isn't already in route. If it is, do nothing
    if (!route.includes(pointIndexToInsert)) {
        route.splice(atIndex, 0, pointIndexToInsert);
        updateUnassignedPoints();
        drawRoutes();
    } else {
        console.log('point already in route');
    }   
}

function getDistanceBetweenPoints(pointAIndex, pointBIndex) {
    /*
    Returns distance between points at specified indices.
    */
   let pointA = points[pointAIndex];
   let pointB = points[pointBIndex];
   let distance = dist(pointA.vector.x, pointA.vector.y, pointB.vector.x, pointB.vector.y);
   return distance;
}

function getRouteLength(route) {
    /*
    Returns total length of given route.
    */
    var totalDistance = 0;
    for (var i = 0; i < route.length - 1; i++) {
        let point = points[route[i]];
        let nextPoint = points[route[i+1]];
        let distance = dist(point.vector.x, point.vector.y, nextPoint.vector.x, nextPoint.vector.y);
        totalDistance += distance;
    }
    return totalDistance;
}
