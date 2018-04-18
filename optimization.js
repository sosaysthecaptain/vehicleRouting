// functions pertaining to improving the initial routes go here


function logCurrentRouteStats() {
    /*
    Calculates and logs current route length
    */
   let routeALength = getRouteLength(routeA);
   let routeBLength = getRouteLength(routeB);
   let totalRouteLength = routeALength + routeBLength;
//    console.log('Total route length: ' + floor(totalRouteLength));
//    console.log('  RouteA: ' + floor(routeALength));
//    console.log('  RouteB: ' + floor(routeBLength));
}

function unassignPointsWithinDistance(pointIndex, distance) {
    /*
    Unassigns all points within specified range of given point.
    */
    let pointsWithinRange = getPointsInRange(pointIndex, distance)
    for (var i = 0; i < pointsWithinRange.length; i++) {
        removeFromRoute(pointsWithinRange[i]);
    }
    drawRoutes();
}

function largeNeighborhoodSearch(range) {
    /*
    Route optimization heuristic. Cycles through all points, for each:
        - unassigns all points within range
        - heals, reassigning unassigned points to their most logical routes
        - assesses total length of resulting route structure
        if better:
            - adds to history, leaves routeA and routeB set to new values
        else:
            - returns routeA and routeB to their original form
    */

    console.log('Running large neighborhood search, range: ' + range);
    for (var i = 1; i < points.length; i++) {
        console.log('    evaluating point ' + i + ', bestToDate: ' + floor(convertRealDistance(bestDistanceToDate)));
        largeNeighborhoodSearchUnit(i, range);
    }
}

function largeNeighborhoodSearchUnit(pointIndex, range) {
    /*
    Unassigns specified neighborhood, heals, assesses. If better, resets routeA and routeB, else returns them to their original state.
    */

    unassignPointsWithinDistance(pointIndex, range);
    heal();
    checkIfBestAndReassign();
}

function checkIfBestAndReassign() {
    /*
    Checks if current routeA and routeB are the running best. If so, resets best & adds them to the route history. If not, restores them.
    */

    let currentDistance = getTotalRouteLength();
    if (currentDistance < bestDistanceToDate) {
        bestDistanceToDate = currentDistance;
        routeAHistory.push(routeA.slice(0));
        routeBHistory.push(routeB.slice(0));
        console.log('New best route pair: ' + convertRealDistance(bestDistanceToDate).toFixed(1) + ' miles');
    } else {
        routeA = routeAHistory[routeAHistory.length - 1].slice(0);
        routeB = routeBHistory[routeBHistory.length - 1].slice(0);
    }
}