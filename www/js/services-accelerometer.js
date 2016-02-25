angular.module('starter.services-accelerometer', [])

.factory('Accelerometer', function($cordovaDeviceMotion) {
  // Setup circle params for drawing
  var canvas, ctx, watch, w, h;
  var TAU = Math.PI * 2;

  // watch Acceleration options
  var options = { 
      frequency: 20, // Measure every 100ms
      deviation : 25,  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
      xOrigin: 150,
      yOrigin: 75
  };
   
  var radius = null;

  var currentXWithRespectToOrigin = null;
  var currentYWithRespectToOrigin = null;

  // Current measurements
  var measurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
  };
   
  // Previous measurements    
  var previousMeasurements = {
      x : options.xOrigin,
      y : options.yOrigin,
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
        var currentZ = previousMeasurements.z + result.z;

        currentXWithRespectToOrigin = currentX - options.xOrigin;
        currentYWithRespectToOrigin = currentY - options.yOrigin;

        drawCircle(currentX, currentY);   
        radius = Math.sqrt(currentXWithRespectToOrigin*currentXWithRespectToOrigin
         + currentYWithRespectToOrigin+currentYWithRespectToOrigin);  

        // Set previous data  
        previousMeasurements.x = currentX;
        previousMeasurements.y = currentY;
        previousMeasurements.z = currentZ;
        previousMeasurements.timestamp = result.timestamp;          
    });     
  };  

  // Stop watching method
  this.stopWatching = function() {  
    watch.clearWatch();
  };

  this.getMeasurements = function() {
  	return measurements;
  }

  this.getRadius = function() {
  	return radius;
  }
  this.getCurrentXWithRespectToOrigin = function() {
  	return currentXWithRespectToOrigin;
  }
  this.getCurrentYWithRespectToOrigin = function() {
  	return currentYWithRespectToOrigin;
  }


  function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,8,0,TAU);
    ctx.fill();
    ctx.closePath();
  };

  return this;
});