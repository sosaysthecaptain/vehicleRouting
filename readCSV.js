function processCSV() {
    /*
    Imports the CSV, parses it, creates a new point for each entry, enters these into points array. Then instantiates routes.
    */

    // set depot manually
    //let depot = new point('Depot', 'NA', -87.6618988, 41.8851024);        // real depot
    let depot = new point('TestDepot', 'NA', -86, 41);                       // test map depot
    points.push(depot);

    for (var i = 1; i < csv.length; i++) {
        var lineArray = csv[i].splitCSV();
        
        var pointName = lineArray[0];
        var pointAddress = lineArray[1];
        var pointY = lineArray[2];
        var pointX = lineArray[3];

        var newPoint = new point(pointName, pointAddress, pointX, pointY);
        points.push(newPoint);
    }

    

    // set relative coords, now that max and min are established
    for (var i = 0; i < points.length; i++) {
        points[i].setRelXY();
    }
    
}

// A handy gift of the internet, from http://www.greywyvern.com/?post=258
// allows CSV cells to be split correctly even if they contain commas
String.prototype.splitCSV = function(sep) {
    for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
      if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
        if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
          foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
        } else if (x) {
          foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
        } else foo = foo.shift().split(sep).concat(foo);
      } else foo[x].replace(/""/g, '"');
    } return foo;
  };
