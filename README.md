INSTRUCTIONS:

  - Live version is hosted at http://www.marcauger.xyz/vehiclerouting/index.html. (Note that code must be run from a server for CSV loading to work.) Source is available at github.com/sosaysthecaptain/https://github.com/sosaysthecaptain/vehicleRouting
  - To solve the Chicago map, open the console and run "solve()". Problem will be solved, routes outputted to the console, and upon completion an animation will play illustrating each step of the process.
  - To generate a random map, run "generateRandomMap(numberOfPoints)", then "solve()".
  - Functions available once map has been solved:
    - animate() - replay the animation
    - zoomInOnCity() - zoom in on Chicago proper
    - resetZoom() - restore original zoom
    - generateRandomMap(numberOfPoints) - generate a random map
    - solve() - solve current map

HOW IT WORKS

This project provides approximate solutions to the vehicle routing problem in exponential time with a heuristic method using seed notes, greedy addition, and large neighborhood search. The gist of the control flow is explained here, extensive documentation at a higher level of detail is provided throughout the code. The control flow works as such:
  
  1) The CSV file containing points is loaded, and for each point an instance of the point class is instantiated, containing both the GPS coordinates and relative coordinates mapped to the screen. All points are loaded into the points array, and are henceforth referenced by index number.

  2) The map, represented by the points array, is drawn by the drawPointsArray() function. Routes, stored in variables routeA and routeB, will subsequently be drawn by the drawRoutes() function. Graphics are handled by the p5 library.

  3) The first step to solving the map is to find the point furthest from the depot and add it to routeA, then the point furthest from that and add it to routeB.

  4) Thereafter, points are added pairwise. For each route, the unassigned point closest to each route is added, at the point that would add the least total distance to the array. This process proceeds until no more unassigned points are left. This tends to produce a reasonable route map, but often with regions in which both vehicles are doubled up. Each step of the process is documented in the routeHistory variables, for the sake of later visualization.

  5) The large neighborhood search method is then applied. For each point, all the points within a certain distance of that point are unassigned, simplifying the routes. The map is then healed, with each point being added to the route that adds the least total distance to the map. If this process produces a shorter route pair, the improvement is used, and new route is logged to route history variables.

  6) The results are logged to the console. An animation plays, detailing the process by which map was solved.

ASSUMPTIONS, CONSIDERATIONS, AND LIMITATIONS:

    - This model completely fails to take real world routing/traffic conditions into account, and is therefore an idealization.
    - Much could be said about how to weight evenness of routes, driving time vs delivery time, load factors, and how to handle the distribution of long drives to Milwaukee vs. frequent stops around Chicago. In designing this heuristic, I assume we want a relatively even distribution in terms of number of stops.
    - To this end, the Chicago map is solved with a neighborhood radius of zero, meaning that rather than unassigning an entire region, only single points are unassigned. Otherwise, all of the close stops bunch up on one route. When running more randomly distributed maps, a larger radius is desirable. Therefore, when solving a random map, the radius is set to 50. Feel free to play around with this--the variable is called largeNeighborhoodSearchRadius. Note that larger radius values increase computational cost significantly on large maps.