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