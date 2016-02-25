angular.module('starter.services-accelerometer', [])

.factory('Accelerometer', function($cordovaDeviceMotion) {
  // Setup circle params for drawing
  var canvas, ctx, watch, w, h;
  var TAU = Math.PI * 2;

  // watch Acceleration options
  var options = { 
      frequency: 100, // Measure every 100ms
      deviation : 25  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
  };
   
  var radius = null;

  // Current measurements
  var measurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
  };
   
  // Previous measurements    
  var previousMeasurements = {
      x : 150,
      y : 75,
      z : null,
      timestamp : null
  };

  this.setCanvas = function(viewCanvas) {
  	canvas = viewCanvas;
  	ctx = canvas.getContext('2d');
  }

  //Start Watching method
  this.startWatching = function() {     
    // Device motion configuration
    watch = $cordovaDeviceMotion.watchAcceleration(options);
 
    // Device motion initilaization
    watch.then(null, function(error) {
        console.log('Error');
    },function(result) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set current data  
        measurements.x = result.x;
        measurements.y = result.y;
        measurements.z = result.z;
        measurements.timestamp = result.timestamp;    

        // Calculate new coordinates        
        var currentX = previousMeasurements.x + (-1)*result.x;
        var currentY = previousMeasurements.y + result.y;

        drawCircle(currentX, currentY);   

        // Set previous data  
        previousMeasurements.x = currentX;
        previousMeasurements.y = currentY;
        previousMeasurements.z = result.z;
        previousMeasurements.timestamp = result.timestamp; 

        // Calculate radius using Pythagorean
        radius = Math.sqrt(result.x*result.x + result.y*result.y);           
    });     
  };  

  // Stop watching method
  this.stopWatching = function() {  
    watch.clearWatch();
  };

  this.getMeasurements = function() {
  	return measurements;
  }

  function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,8,0,TAU);
    ctx.fill();
    ctx.closePath();
  };

  return this;
});