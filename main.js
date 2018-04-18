var points = [];  
var unassignedPoints = [];
var routeA = [0, 1, 0];      // route points are denoted by index values of points array
var routeB = [0, 2, 0];

var routeAHistory = [];
var routeBHistory = [];

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
function solve() {
  /*
  Call this to solve the map.
  */
  console.log('SOLVING MAP');
  routeAHistory = [];
  routeBHistory = [];

  assembleRoutes();

  console.log('MAP SOLVED. Showing animation of steps...')
  console.log('  to view again, call animate()');
  logSolution();
  setTimeout(animate, 1000);
  
}

var animateIndex = 0;
function animate() {
  /*
  Animates all the steps the solve() function went through to solve the map. Callable only once solve has run.
  */

 animateIndex += 1;
  if (animateIndex < routeAHistory.length) {
      background(0);
      drawPointArray(points);

      drawHistoricRoute(animateIndex);

      //console.log('  Showing animation: step ' + animateIndex);
      setTimeout(animate, 100);
  } else {
    animateIndex = -1;
  }
}
