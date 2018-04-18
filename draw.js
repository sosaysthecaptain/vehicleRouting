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