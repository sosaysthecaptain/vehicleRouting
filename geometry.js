// Functions pertaining to geometry and routing

function assembleRoutes() {
    /*
    Inserts seed points, then greedily adds points to each array.
    */

    console.log('Assembling initial routes...');
    addSeedPoints();
    while (unassignedPoints.length > 0) {
        console.log('  Adding route pair. Points remaining: ' + unassignedPoints.length);
        addNextPair();
        drawRoutes();
    }
    //logCurrentRouteStats();

    // set initial value for bestDistanceToDate
    let distance = getRouteLength(routeA) + getRouteLength(routeB);
    if (distance < bestDistanceToDate) {
        bestDistanceToDate = distance;
    }
}

function addNextPair() {
    /*
    Adds the next closest point to both routes, stepwise. Updates and draws.
    */

    if (unassignedPoints.length > 0) {
        routeA = insertNearestPoint(routeA);
        updateUnassignedPoints();
    }
    if (unassignedPoints.length > 0) {
        routeB = insertNearestPoint(routeB);
        updateUnassignedPoints();
    }
    drawRoutes();
    recordRouteHistory();
}

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
    recordRouteHistory();
}

function insertNearestPoint(route) {
    /*
    Given a route, inserts the nearest point into the position which produces the shortest possible route. Returns the route with the added point. User must assign returned route to its original variable and redraw the routes.

    VERY IMPORTANT: call updateUnassignedPoints() before using this function a second time.

    Makes use of findPointNearestRoute() and getRouteLength()
    */

    // find the nearest point
    let nearestPointIndex = findPointWithLowestCostOfAddition(route);

    var bestCandidateRouteLength = Infinity;
    var bestCandidateRoute = [];
    // for position in route, construct a candidate route
    for (var i = 1; i < route.length; i++) {
        var candidateRoute = route.slice();
        insertPointIntoRoute(nearestPointIndex, candidateRoute, i);
        let candidateRouteLength = getRouteLength(candidateRoute);

        if (candidateRouteLength < bestCandidateRouteLength) {
            bestCandidateRouteLength = candidateRouteLength;
            bestCandidateRoute = candidateRoute.slice();
        }
    }
    route = bestCandidateRoute.slice(0);
    return route;
}

function findPointNearestRoute(route) {
    /*
    Returns index of unassigned point nearest one of the points on the given route.

    SUPERCEDED BY findPointWithLowestCostOfAddition
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
            if (distance < bestDistance) {
                bestDistance = distance;
                bestPointIndex = candidatePointIndex;
            }
        }
    }

    highlightPoint(bestPointIndex);
    return bestPointIndex;
}

function removeFromRoute(pointIndex) {
    /*
    Removes specified point from route, whichever it happens to be in. Redraws. Does nothing if point not in route.
    */
//    if (routeA.includes(pointIndex)) {
//        console.log('point in routeA');
//        removeNumberFromArray(pointIndex, routeA);
//    } else if (routeB.includes(pointIndex)) {
//        console.log('point in routeB');
//        removeNumberFromArray(pointIndex, routeB);
//    }
   removeNumberFromArray(pointIndex, routeA);
   removeNumberFromArray(pointIndex, routeB);
   drawRoutes();

}

// function addPointToClosestRoute(pointIndex) {
//     /*
//     Given an unassigned point, adds it to the most logical route.
//     */

//     // find the closest route
//     let distanceFromRouteA = getDistanceOfPointFromRoute(pointIndex, routeA);
//     let distanceFromRouteB = getDistanceOfPointFromRoute(pointIndex, routeB);

//     if (distanceFromRouteA < distanceFromRouteB) {
//         // add to routeA
//         routeA = insertPointAtBestLocationInRoute(pointIndex, routeA);
//     } else {
//         // add to routeB
//         routeB = insertPointAtBestLocationInRoute(pointIndex, routeB);
//     }
//     drawRoutes();
// }

function insertPointAtBestLocationInRoute(pointIndex, route) {
    /*
    Given a pointIndex and a route, adds the point at the most logical place in the route.

    Returns route. Note: this means that assignment/drawing must be done manually.
    */

    var bestCandidateRouteLength = Infinity;
    var bestCandidateRoute = [];
    // for position in route, construct a candidate route
    for (var i = 1; i < route.length; i++) {
        var candidateRoute = route.slice();
        insertPointIntoRoute(pointIndex, candidateRoute, i);
        let candidateRouteLength = getRouteLength(candidateRoute);

        if (candidateRouteLength < bestCandidateRouteLength) {
            bestCandidateRouteLength = candidateRouteLength;
            bestCandidateRoute = candidateRoute.slice();
        }
    }

    return bestCandidateRoute;
}

function findPointWithLowestCostOfAddition(route) {
    /*
    Finds the point that would cost the least additional distance to add to the route.
    */
    
    var bestDistance = Infinity;
    var bestPointIndex = 0;

    // for unassigned points, find the one with the least cost of addition
    for (var i = 0; i < unassignedPoints.length; i++) {
        let additionalDistance = getCostOfAddingPointToRoute(unassignedPoints[i], route);
        if (additionalDistance < bestDistance) {
            bestDistance = additionalDistance;
            bestPointIndex = unassignedPoints[i];
        }
    }
    highlightPoint(bestPointIndex);
    return bestPointIndex;

    // // for point in route that isn't the depot
    // for (var i = 1; i < route.length - 1; i++) {
    //     routePointIndex = route[i];

    //     // iterate through unassignedPoints, find the one that would add the least distance to the route
    //     for (var j = 0; j < unassignedPoints.length; j++) {
    //         let candidatePointIndex = unassignedPoints[j];
    //         let addedDistance = 
    //         if (distance < bestDistance) {
    //             bestDistance = distance;
    //             bestPointIndex = candidatePointIndex;
    //         }
    //     }
    // }

    // highlightPoint(bestPointIndex);
    // return bestPointIndex;

}

function getCostOfAddingPointToRoute(pointIndex, route) {
    /*
    Returns the additional cost (distance) of adding a point to a specified route.
    */
   let baselineDistance = getRouteLength(route);
   let candidateRoute = insertPointAtBestLocationInRoute(pointIndex, route);
   let candidateDistance = getRouteLength(candidateRoute);
   return (candidateDistance - baselineDistance);
}

function addPointToBestRoute(pointIndex) {
    /*
    Adds point to route to which its addition will add the least total distance.
    */

    let marginalDistanceA = getCostOfAddingPointToRoute(pointIndex, routeA);
    let marginalDistanceB = getCostOfAddingPointToRoute(pointIndex, routeB);

    if (marginalDistanceA < marginalDistanceB) {
        routeA = insertPointAtBestLocationInRoute(pointIndex, routeA);
    } else {
        routeB = insertPointAtBestLocationInRoute(pointIndex, routeB);
    }
    drawRoutes();
}

function getLeastCostOfAddition(pointIndex) {
    /*
    Returns the lowest possible cost of addition of the given point to one or the other of the routes.
    */
   let costA = getCostOfAddingPointToRoute(pointIndex, routeA);
   let costB = getCostOfAddingPointToRoute(pointIndex, routeB);
   return min(costA, costB);
}

function heal() {
    /*
    While unassigned points exists, finds the one with the least cost of addition and adds it opportunistically.
    */
   while(unassignedPoints.length > 0) {
       // find the one with the lowest cost of addition
       var bestCostOfAddition = Infinity;
       var bestPointIndex = 0;
       for (var i = 0; i < unassignedPoints.length; i++) {
           let candidateCostOfAddition = getLeastCostOfAddition(unassignedPoints[i]);
           if (candidateCostOfAddition < bestCostOfAddition) {
               bestCostOfAddition = candidateCostOfAddition;
               bestPointIndex = unassignedPoints[i];
           }
       }

       // add it
       addPointToBestRoute(bestPointIndex);
   }
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

    drawRoutes();
}

function logMaxMinCoords() {
    /*
    Logs global minX, maxX, minY, maxY.
    */
    console.log('minX: ' + minX);
    console.log('maxX: ' + maxX);
    console.log('minY: ' + minY);
    console.log('maxY: ' + maxY);
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

function getDistanceOfPointFromRoute(pointIndex, route) {
    /*
    Returns distance of how near a point is to the closest stop on given route.
    */
   var bestDistance = Infinity;
   var bestCandidateIndex = 0;
   let referencePoint = points[pointIndex];
   for (var i = 0; i < route.length; i++) {
       let candidatePoint = points[route[i]];
       let distance = dist(referencePoint.vector.x, referencePoint.vector.y, candidatePoint.vector.x, candidatePoint.vector.y);
       if (distance < bestDistance) {
           bestDistance = distance;
           bestCandidateIndex = i;
       }
   }
   return bestDistance;
}

function recordRouteHistory() {
    /*
    Adds the current routeA and routeB to the routeHistory arrays.
    */
    routeAHistory.push(routeA);
    routeBHistory.push(routeB);
}

function getRealRouteDistance(route) {
    /*
    Given route, returns distance in miles, rounded to nearest hundredth.
    */
   let distance = getRouteLength(route);
   let realWorldDistance = distance * 0.3564;
   return realWorldDistance;
}

function getRealDistance(pointIndexA, pointIndexB) {
    /*
    Given two point indices, returns the distance in miles between them.
    */
   let distance = getDistanceBetweenPoints(pointIndexA, pointIndexB);
   let realWorldDistance = distance * 0.3564;
   return realWorldDistance;
}

function convertRealDistance(distance) {
    /*
    Converts from p5 distance to real world distance.
    */
   return distance * 0.3564;
}

function getPointsInRange(pointIndex, range) {
    /*
    Returns array of pointIndices within range of the specified point. If range is given as zero, returns only the point itself.
    */
    var returnArray = [pointIndex];
    if (range > 0) {
        for (var i = 0; i < points.length; i++) {
            let distanceToPoint = getDistanceBetweenPoints(pointIndex, i);
            if (distanceToPoint < range) {
                returnArray.push(i);
            }
        }
    }

    // debug
    for (var i = 0; i < returnArray.length; i++) {
        highlightPoint(returnArray[i]);
    }
    return returnArray;
}

function logSolution() {
    /*
    Logs final output to the console.
    */
   let routeARealDistance = getRealRouteDistance(routeA);
   let routeBRealDistance = getRealRouteDistance(routeB);
   let overallRealDistance = routeARealDistance + routeBRealDistance;
   console.log('***********************');
   console.log('ROUTE SUMMARY');
   console.log('    Overall distance: ' + floor(overallRealDistance) + ' miles');

   // routeA
   console.log('RouteA, ' + floor(routeARealDistance) + ' miles. Stops: ' + (routeA.length - 2));
    for (var i = 0; i < routeA.length - 1; i++) {
        let pointItself = points[routeA[i]];
        let distToNext = getRealDistance(routeA[i], routeA[i+1]);
        distToNext = distToNext.toFixed(1);
        console.log('    ' + pointItself.pointName + ', i = ' + pointItself.index + '. Dist: ' + distToNext);
    }
    let lastOfRouteA = points[routeA[routeA.length - 1]];
    console.log('    ' + lastOfRouteA.pointName + ', i = ' + lastOfRouteA.index + '.');

    // routeB
    console.log('RouteB, ' + floor(routeBRealDistance) + ' miles. Stops: ' + (routeB.length - 2));
   for (var i = 0; i < routeB.length - 1; i++) {
       let pointItself = points[routeB[i]];
       let distToNext = getRealDistance(routeB[i], routeB[i+1]);
       distToNext = distToNext.toFixed(1);
       console.log('    ' + pointItself.pointName + ', i = ' + pointItself.index + '. Dist: ' + distToNext);
   }
   let lastOfRouteB = points[routeB[routeB.length - 1]];
   console.log('    ' + lastOfRouteB.pointName + ', i = ' + lastOfRouteB.index + '.');
}

function getTotalRouteLength() {
    /*
    Returns total length of current routes.
    */
    var routeADistance = getRouteLength(routeA);
    let routeBDistance = getRouteLength(routeB);
   
    return routeADistance + routeBDistance;

}