angular.module('starter.services-accelerometer', [])

.factory('Accelerometer', function($cordovaDeviceMotion) {
  // Setup circle params for drawing
  var canvas, ctx, watch, w, h;
  var TAU = Math.PI * 2;

  // watch Acceleration options
  var options = { 
      frequency: 50, // Measure every 100ms
      deviation : 25,  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
      xOrigin: 150,
      yOrigin: 150,
      radarRadius: 148,
      xUpper: 148*2,
      yUpper: 148*2,
      xLower: 2,
      yLower: 2
  };
   
  var radius = null;

  var absement = null;

  var radiusArray = [];

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

	// Draw radar
    drawRadar(options.xOrigin, options.yOrigin, options.radarRadius);
    // Draw center aim
    drawCenter(options.xOrigin, options.yOrigin, 16);
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
        if(currentX > options.xUpper) {
        	currentX = options.xUpper;
        } else if(currentX < options.xLower) {
        	currentX = options.xLower;
        }
        var currentY = previousMeasurements.y + result.y;
        if(currentY > options.yUpper) {
        	currentY = options.yUpper;
        } else if(currentY < options.yLower) {
        	currentY = options.yLower;
        }
        
        var currentZ = previousMeasurements.z + result.z;

        currentXWithRespectToOrigin = currentX - options.xOrigin;
        currentYWithRespectToOrigin = currentY - options.yOrigin;

        // Draw radar
        drawRadar(options.xOrigin, options.yOrigin, options.radarRadius);
        // Draw center aim
        drawCenter(options.xOrigin, options.yOrigin, 16);
        drawCircle(currentX, currentY);   
        radius = Math.sqrt(parseFloat(currentXWithRespectToOrigin)*parseFloat(currentXWithRespectToOrigin)
         + parseFloat(currentYWithRespectToOrigin)*parseFloat(currentYWithRespectToOrigin));  

        radiusArray.push(radius);

        // Set previous data  
        previousMeasurements.x = currentX;
        previousMeasurements.y = currentY;
        previousMeasurements.z = currentZ;
        previousMeasurements.timestamp = result.timestamp;          
    });     
  };  

  this.init = function() {
  	currentXWithRespectToOrigin = null;
	currentYWithRespectToOrigin = null;

	// Current measurements
	measurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
	};
	   
    // Previous measurements    
    previousMeasurements = {
      x : options.xOrigin,
      y : options.yOrigin,
      z : null,
      timestamp : null
    };

    radius = 0;
    radiusArray = [];
  }
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
  this.getRadiusArray = function() {
  	return radiusArray;
  }
  this.getCurrentXWithRespectToOrigin = function() {
  	return currentXWithRespectToOrigin;
  }
  this.getCurrentYWithRespectToOrigin = function() {
  	return currentYWithRespectToOrigin;
  }
  this.getAbsement = function () {
  	absement = 0 ;
  	//console.log(radiusArray);
  	for(var i=0; i<radiusArray.length; i++) {
    	absement+=radiusArray[i];
   	}
   	return absement;
  }

  function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,8,0,TAU);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
  };

  function drawRadar(x, y, r) {
    ctx.beginPath();
    ctx.arc(x,y,r,0,TAU);
    ctx.fillStyle = '#387ef5';
	ctx.fill();
    ctx.closePath();
  };

  function drawCenter(x,y,r) {
  	ctx.beginPath();
    ctx.arc(x,y,r,0,TAU);
    ctx.fillStyle = '#4F8EF7';
	ctx.fill();
    ctx.closePath();
  }

  return this;
});