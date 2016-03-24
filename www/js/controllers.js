angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaDeviceMotion, $ionicLoading, $ionicPlatform, $interval, $timeout, Accelerometer, Chats) {
  var canvas
  var timeout; 

  var playingAlert = false;

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var source;

  $scope.playbackRate = 1;
  // Default to 5
  $scope.count = 5; // 5 second timer

  $scope.countDown = 5;
  $scope.radius;

  $scope.absement; 

  $scope.currentXWithRespectToOrigin;
  $scope.currentYWithRespectToOrigin;

  // Timer function
  $scope.timer = null;

  $scope.accelerometer = Accelerometer;

  // Current measurements
  $scope.measurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
  };

  $ionicPlatform.ready(function() {
    canvas=document.getElementById('myCanvas'); 
    Accelerometer.setCanvas(canvas);

    getData();
    //Initialize without playing
    source.start(0);
    changeRate(0);
  });

  //Start Watching method
  $scope.startWatching = function(newCount) {    
    Accelerometer.init(); 
    Accelerometer.startWatching();

    // Initiate variables
    $scope.count = newCount;
    $scope.absement = 0;

    timeout = $scope.count * 1000;
    console.log("newCount is: " + newCount);
    console.log("timeout is: " + timeout);
    startTimer(timeout);

    // Start playing
    changeRate(1);
  };  

  // Stop watching method
  $scope.stopWatching = function() {  
    Accelerometer.stopWatching();
    stopCountDown();
    //console.log(Accelerometer.getRadiusArray());
    $scope.absement = $scope.measurementRound($scope.accelerometer.getAbsement(), 2);

    var score = {
      id: Chats.getLastId(),
      name: 'Pushup',
      lastText: 'Score: ' + $scope.measurementRound($scope.absement, 2),
      face: ' ',
      radiusArray: Accelerometer.getRadiusArray(),
      xAxisArray:'',
      yAxisArray:''
    }
    Chats.add(score);

    // Stop music
    changeRate(0);
  };

  // For testing
  $scope.$watch('accelerometer.getMeasurements()', function(newMeasurements) {
    $scope.measurements = newMeasurements;
  });
  $scope.$watch('accelerometer.getRadius()', function(newRadius) {
    $scope.radius = $scope.measurementRound(newRadius, 2);

    // Change music pitch
    var rate = 1 - $scope.radius/300;
    console.log("got the radius");
    if(source.playbackRate.value !=0) {
      changeRate(rate);
    }
  });
  $scope.$watch('accelerometer.getCurrentXWithRespectToOrigin()', function(newX) {
    $scope.currentXWithRespectToOrigin = newX;
  });
  $scope.$watch('accelerometer.getCurrentYWithRespectToOrigin()', function(newY) {
    $scope.currentYWithRespectToOrigin = newY;
  });

  $scope.measurementRound = function(measurement, decimals) {
    return precise_round(measurement, decimals);
  }

  // Put in accelerometer service
  function precise_round(num, decimals) {
    var t=Math.pow(10, decimals);   
    return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
  }

  // Perform count down, and stop measure once count down reached
  function startTimer(timeout) {
    // Start counting down
    $scope.timer = $interval(function() { 
      //console.log("Count is now: " + $scope.count);
      $scope.count--;
      // $scope.$apply();
    }, 1000);

    // Stop watching after timeout interval
    $timeout(function(){ 
      $scope.stopWatching(); 
      stopCountDown();
    }, timeout);
  }

  function stopCountDown() {
    if(angular.isDefined($scope.timer)) {
      $interval.cancel($scope.timer);
    }
  }

  // Get music data
  function getData() {
    $ionicLoading.show({
      template: "Loading..."
    });

    source = audioCtx.createBufferSource();
    var request = new XMLHttpRequest();

    request.open('GET', 'audio/demo.mp3', true);

    request.responseType = 'arraybuffer';

    console.log(request);

    request.onload = function() {
      var audioData = request.response;

      audioCtx.decodeAudioData(audioData, function(buffer) {
        source.buffer = buffer;

        source.connect(audioCtx.destination);
        source.loop = true;
        $ionicLoading.hide();
      },

      function(e){"Error with decoding audio data" + e.err});

    }

    request.send();
  }

  function changeRate(rate) {
    source.playbackRate.value = rate;
  }
})




.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})





.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, Accelerometer) {
  var frequency = 1000/Accelerometer.getOptions().frequency;
  console.log(frequency);
  var workout = Chats.get($stateParams.chatId);
  var workoutData = workout.radiusArray;

  var seconds = workoutData.length/frequency; // this is based on frequency, should be whole number
  console.log("workoutdata length: " + workoutData.length);

  // Initialize data arrays
  var displacementData = [0];
  var asbementData = [0];
  var velocityData = [];

  console.log(workoutData);
  console.log("Seconds: " + seconds);

  // Populate the data from radius array
  var displacement = 0;
  var previousDisplacement = 0;
  var absement = 0;
  var velocity = 0;
  for(var i=0;i<workoutData.length;i++) {
    displacement = displacement + workoutData[i];
    absement = absement + workoutData[i];;
    if((i+1)%frequency == 0) {

      // At every 20ms
      var average = displacement / frequency;
      displacementData.push(average);
      displacement = 0;
      // Push absement to array
      asbementData.push(absement);

      velocity = (average - previousDisplacement)/1; //per second
      velocityData.push(velocity);
      previousDisplacement = average;
      // console.log(i);
      // console.log(average);
    }
  }
  console.log("absement: " + asbementData);
  console.log("displacement: " + displacementData);

  // Populate xlabel with the number of seconds
  var myLabel = [];
  for(var i=0;i<seconds;i++) {
    myLabel.push(i + 's');
  }

  var velocityLabel = [];
  for(var i=0;i<seconds-1;i++) {
    velocityLabel.push(i + 's');
  }
  console.log("labels: " +  myLabel);

  $scope.absementChartData = {
    labels: myLabel,
    datasets: [
      {
        label: "Absement",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: asbementData
      }
    ]
  };

  $scope.displacementChartData = {
    labels: myLabel,
    datasets: [
      {
        label: "Displacement",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: displacementData
      }
    ]
  };

  $scope.velocityChartData = {
    labels: velocityLabel,
    datasets: [
      {
        label: "Displacement",
        fillColor: "rgba(255,0,0,0.2)",
        strokeColor: "rgba(255,0,0,1)",
        pointColor: "rgba(255,0,0,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(255,0,0,1)",
        data: velocityData
      }
    ]
  };

  $scope.options = {
    scaleGridLineWidth : 0.5,
    bezierCurve : false,
    pointDot : false,
    datasetStrokeWidth : 1
  };
})




.controller('AccountCtrl', function($scope, $cordovaNativeAudio) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.sensitivity
});
