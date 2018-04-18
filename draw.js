// Functions pertaining to drawing information on the screen

function drawPointArray(pointArray) {
    /*
    Displays points array on map, with depot (points[0]) in red
    */

    // draw depot in red
    stroke(255, 0, 0);
    strokeWeight(4);
    noFill();
    beginShape();
    ellipse(points[0].vector.x, points[0].vector.y, 4, 4);
    endShape();
  
    // draw all other points in white
    stroke(255);
    for(var i = 1; i < pointArray.length; i++) {
      var pointInstance = pointArray[i];
      //vertex(pointInstance.vector.x, pointInstance.vector.y);
      ellipse(pointInstance.vector.x, pointInstance.vector.y, 4, 4);
  
    }
}

function drawDepot() {
    /*
    Draws depot in red. Useful as a standalone function so it can be drawn on top of things that cover it up.
    */

    stroke(255, 0, 0);
    strokeWeight(4);
    noFill();
    beginShape();
    ellipse(points[0].vector.x, points[0].vector.y, 4, 4);
    endShape();
}


function highlightPoint(pointIndex) {
    /*
    Draws a circle around point at specified index
    */
   stroke(128, 255, 0);
   strokeWeight(4);
   noFill();
   beginShape();
   ellipse(points[pointIndex].vector.x, points[pointIndex].vector.y, 15, 15);
   endShape();
}

function drawRoutes() {
    /*
    Draws both routes. routeA is magenta, routeB is teal
    */

    // updateUnassignedPoints here, save typing
    updateUnassignedPoints();

    // reset background, draw map
    background(0);
    drawPointArray(points);

    // routeA
    stroke(204, 0, 102);
    beginShape();
    for(var i = 0; i < routeA.length; i++) {
        var pointIndex = routeA[i];
        var pointInstance = points[pointIndex];
        vertex(pointInstance.vector.x, pointInstance.vector.y);
        ellipse(pointInstance.vector.x, pointInstance.vector.y, 7, 7);
    }
    endShape();

    // routeB
    stroke(0, 255, 255);
    beginShape();
    for(var i = 0; i < routeB.length; i++) {
        var pointIndex = routeB[i];
        var pointInstance = points[pointIndex];
        vertex(pointInstance.vector.x, pointInstance.vector.y);
        ellipse(pointInstance.vector.x, pointInstance.vector.y, 7, 7);
    }
    endShape();
}

function drawHistoricRoute(animateIndex) {
    /*
    Draws historic route of given index.

    In the process, overwrites current routeA and routeB variables. Later resets them to the latest entry in history.
    */
    
    // set routes
    routeA = routeAHistory[animateIndex];
    routeB = routeBHistory[animateIndex];

    // updateUnassignedPoints here, save typing
    updateUnassignedPoints();

    // reset background, draw map
    background(0);
    drawPointArray(points);

    // routeA
    stroke(204, 0, 102);
    beginShape();
    for(var i = 0; i < routeA.length; i++) {
        var pointIndex = routeA[i];
        var pointInstance = points[pointIndex];
        vertex(pointInstance.vector.x, pointInstance.vector.y);
        ellipse(pointInstance.vector.x, pointInstance.vector.y, 7, 7);
    }
    endShape();

    // routeB
    stroke(0, 255, 255);
    beginShape();
    for(var i = 0; i < routeB.length; i++) {
        var pointIndex = routeB[i];
        var pointInstance = points[pointIndex];
        vertex(pointInstance.vector.x, pointInstance.vector.y);
        ellipse(pointInstance.vector.x, pointInstance.vector.y, 7, 7);
    }
    endShape();

    // reset global routeA and routeB to their latest values
    resetRouteAB();
}

function resetRouteAB() {
    /*
    Helper function. Resets routeA and routeB to the latest in the history.
    */
   routeA = routeAHistory[routeAHistory.length - 1].slice(0);
   routeB = routeBHistory[routeBHistory.length - 1].slice(0);
}

var highlightIndex = -1;
function highlightSequentially() {
    /*
    Debug method. Iterates through all points in points, logging their index and name to the console.

    Recursive implementation. If highlightIndex is not above points.length, highlights/logs, and then calls self with setTimeout. At the end, resets highlightIndex to -1. 
    */
    highlightIndex += 1;
    if (highlightIndex < points.length) {
        background(0);
        drawPointArray(points);
        drawRoutes();
        highlightPoint(highlightIndex);
        console.log('index: ' + highlightIndex, 'name: ' + points[highlightIndex].pointName);
        setTimeout(highlightSequentially, 750);
    } else {
        highlightIndex = -1;
    }
}

function zoomInOnCity() {
    /*
    For main map, zooms in on Chicago, eliminating the Milwaukee and west suburban locations.
    */
   for (var i = 0; i < points.length; i++) {
       points[i].setRelXYChicago();
   }

   // redraw everything
   background(0);
   drawPointArray(points);
   drawRoutes();
   drawDepot();
}

function resetZoom() {
    /*
    For main map, zooms in on Chicago, eliminating the Milwaukee and west suburban locations.
    */
   for (var i = 0; i < points.length; i++) {
       points[i].setRelXY();
   }

   // redraw everything
   background(0);
   drawPointArray(points);
   drawRoutes();
   drawDepot();
}