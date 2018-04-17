//var http = require('http');

var points = [];
// var minX = -88.2;
// var maxX = -87.6;
// var minY = 41.7;
// var maxY = 43.05;

var minX = 0;       // tend to be around -87, so this is much higher
var maxX = -100;    // tend to be around -87, so this is much lower
var minY = 100;       // tend to be around 41, so this is much higher
var maxY = 0;     // tend to be around 41, so this is much lower

var popSize = 500;
var routePopulation = [];
var flipMutationRate = 0.5;
var exchangeMutationRate = 0.9;

var bestDistance = Infinity;
var bestRoutePairToDate;

var generation = 0;
var routePairIndex = 0;
var pointIndex = 0;

var csv;

function preload() {
  csv = loadStrings('./testing/coordsTest2.csv');
}

function setup() {

  processCSV();               // use this only if ditching jQuery option
  createCanvas(600, 600);
  background(0);
  drawPointArray(points);
  
}

function draw() {
  /*
  Main loop:
    - assessFitness()
      - calculates and sorts current populaton by fitness, finds best individual to date
    - renderRoutes()
      - draw the best route to date, as well as the best route of the batch, on the screen
    - nextGeneration()
      - culls the present generation to create the next one, more highly representing fitter phenotypes
      - performs crossover, adding to genetic diversity
      - introduces random mutations

    All of this is accomplished with the runGeneration() function.
  */

  //background(0);
  //runGeneration();

  //assessFitness();
  //renderRoutes();
  //nextGeneration();

  // TESTING


  // after 1000 generations, log results
  // if (generation == 1000) {
  //   // log results
  //   console.log('Route A: ');
  //   for (var i = 0; i < bestRoutePairToDate.routeAWithDepot.length; i++) {
  //     console.log('    ' + bestRoutePairToDate.routeAWithDepot[i].pointName);
  //   }
  //   console.log('Route B: ');
  //   for (var i = 0; i < bestRoutePairToDate.routeBWithDepot.length; i++) {
  //     console.log('    ' + bestRoutePairToDate.routeBWithDepot[i].pointName);
  //   }
  // }
}






function calcDistance(points, order) {
  var sum = 0;
  for (var i = 0; i < order.length - 1; i++) {
    var cityAIndex = order[i];
    var cityA = points[cityAIndex];
    var cityBIndex = order[i + 1];
    var cityB = points[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}


// *********


function drawRoutePairLight(routePairInstance) {
  // just in case
  //routePairInstance.addDepot();

  // reset background
  background(0);
  
  // draw points in white, will be covered if visited
  drawPointArray(points);

  strokeWeight(3);
  //noFill();
  beginShape();

  // draw route 1
  stroke(0, 255, 0);
  beginShape();
  for(var i = 0; i < routePairInstance.routeAWithDepot.length; i++) {
    var pointInstance = routePairInstance.routeAWithDepot[i];
    vertex(pointInstance.vector.x, pointInstance.vector.y);
    ellipse(pointInstance.vector.x, pointInstance.vector.y, 6, 6);
  }
  endShape();

  // draw route 2
  stroke(0, 0, 255);
  beginShape();
  for(var i = 0; i < routePairInstance.routeBWithDepot.length; i++) {
    var pointInstance = routePairInstance.routeBWithDepot[i];
    vertex(pointInstance.vector.x, pointInstance.vector.y);
    ellipse(pointInstance.vector.x, pointInstance.vector.y, 6, 6);
  }
  endShape();

  // draw depot
  drawDepot();
}


function logRoutePairs(routePairInstance) {
  /*
  Logs routes and distances to console.
  */
  //routePairInstance.addDepot();
  //routePairInstance.calcTotalDistance();

  var routeA = routePairInstance.routeAWithDepot;
  var routeB = routePairInstance.routeBWithDepot;
  var routeANames = [];
  var routeBNames = [];

  for (var i = 0; i < routeA.length; i++) {
    routeANames.push(routeA[i].pointName);
    routeBNames.push(routeB[i].pointName);
  }

  console.log('ROUTE PAIR SUMMARY');
  console.log('Overall distance: ' + floor(routePairInstance.totalDistance));
  console.log('Route A (green), total distance: ' + floor(routePairInstance.totalDistanceA));
  for (var i = 0; i < routeANames.length; i++) {
    if (i < routeANames.length - 1) {
      let pointAtIndex = routeA[i];
      let nextPoint = routeA[i+1];
      let distance = dist(pointAtIndex.relX, pointAtIndex.relY, nextPoint.relX, nextPoint.relY)
      console.log('    ' + i + ': ' + routeANames[i] + ', distance: ' + floor(distance));
    } else {
      console.log('    ' + i + ': ' + routeANames[i]);
    }
    
  }
  console.log('Route B (blue), total distance: ' + floor(routePairInstance.totalDistanceB));
  for (var i = 0; i < routeBNames.length; i++) {
    if (i < routeBNames.length - 1) {
      let pointAtIndex = routeB[i];
      let nextPoint = routeB[i+1];
      let distance = dist(pointAtIndex.relX, pointAtIndex.relY, nextPoint.relX, nextPoint.relY)
      console.log('    ' + i + ': ' + routeBNames[i] + ', distance: ' + floor(distance));
    } else {
      console.log('    ' + i + ': ' + routeBNames[i]);
    }
  }
  
}
