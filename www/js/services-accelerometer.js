angular.module('starter.services-accelerometer', [])

.factory('Accelerometer', function($cordovaDeviceMotion) {
  // Setup circle params for drawing
  var canvas, ctx, watch, w, h;
  var TAU = Math.PI * 2;
  var G = 9.82;

  // watch Acceleration options
  var options = { 
      frequency: 50, // Measure every 50ms
      deviation : 25,  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
      xOrigin: 150,
      yOrigin: 150,
      radarRadius: 148,
      xUpper: 148*2,
      yUpper: 148*2,
      xLower: 2,
      yLower: 2
  };

  var current = {
    x : null,
    y : null,
    z : null
  }
  
  // The qoutient between radar radius boundry and the max possible radius (gravity) measured by accelerometer.
  // Used to propotion the measured radius to the drawn radar field
  var boundOverG = 150/G;

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
        current.x = options.xOrigin + (-1) * result.x * boundOverG;
        if(current.x > options.xUpper) {
        	current.x = options.xUpper;
        } else if(current.x < options.xLower) {
        	current.x = options.xLower;
        }
        current.y = options.yOrigin + result.y * boundOverG;
        if(current.y > options.yUpper) {
        	current.y = options.yUpper;
        } else if(current.y < options.yLower) {
        	current.y = options.yLower;
        }
        current.z = options.zOrigin + result.z * boundOverG;

        // Set previous data  
        previousMeasurements.x = measurements.x;
        previousMeasurements.y = measurements.y;
        previousMeasurements.z = measurements.z;
        previousMeasurements.timestamp = result.timestamp;  

        // Draw radar
        drawRadar(options.xOrigin, options.yOrigin, options.radarRadius);
        // Draw center aim
        drawCenter(options.xOrigin, options.yOrigin, 16);
        // Draw movement dot
        drawCircle(current.x, current.y);

        // Calculate radius
        currentXWithRespectToOrigin = current.x - options.xOrigin;
        currentYWithRespectToOrigin = current.y - options.yOrigin;
        radius = Math.sqrt(parseFloat(currentXWithRespectToOrigin)*parseFloat(currentXWithRespectToOrigin)
         + parseFloat(currentYWithRespectToOrigin)*parseFloat(currentYWithRespectToOrigin));  
        radiusArray.push(radius);
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

  function precise_round(num, decimals) {
    var t=Math.pow(10, decimals);   
    return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
  }

  return this;
});