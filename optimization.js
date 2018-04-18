// functions pertaining to improving the initial routes go here
function logCurrentRouteStats() {
    /*
    Calculates and logs current route length
    */
   let routeALength = getRouteLength(routeA);
   let routeBLength = getRouteLength(routeB);
   let totalRouteLength = routeALength + routeBLength;
   console.log('Total route length: ' + floor(totalRouteLength));
   console.log('  RouteA: ' + floor(routeALength));
   console.log('  RouteB: ' + floor(routeBLength));
}

function neighborhoodDestroy() {
    /*
    Takes out an entire neighborhood
    */
}