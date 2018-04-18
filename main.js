var points = [];  
var unassignedPoints = [];
var routeA = [0, 1, 0];      // route points are denoted by index values of points array
var routeB = [0, 2, 0];

var routeAInsertAfter = 0;      // variable for index of next insertion, routeA
var routeBInsertAfter = 0;      // variable for index of next insertion, routeA

var minX = 0;         // tend to be around -87, so this is much higher
var maxX = -100;      // tend to be around -87, so this is much lower
var minY = 100;       // tend to be around 41, so this is much higher
var maxY = 0;         // tend to be around 41, so this is much lower

var pointIndex = 0;

var csv;
let depot;


function preload() {
  /*
  Loads CSV (note: must be running on a server for this to work).

  Set csv file and depot coordinates here.
  */
  //csv = loadStrings('./testing/coordsTest.csv');
  csv = loadStrings('./testing/coordsTest2.csv');
  //csv = loadStrings('coords.csv');
  //depot = new point('Depot', 'NA', -87.6618988, 41.8851024);        // real depot
  depot = new point('TestDepot', 'NA', -86, 41);                       // test map depot
}

function setup() {

  processCSV(); 
  createCanvas(600, 600);
  background(0);
  drawPointArray(points);
  
}

function draw() {
  /*

  */
}

// ********************************
function buildRoutes() {
  /*
  Main function to build best guess routes. Procedure:
    1) Find furthest point from depot, and furthest point from that. 
  */
}


// *********************************
// old stuff below here



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
