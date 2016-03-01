angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaDeviceMotion, $ionicPlatform, $interval, $timeout, Accelerometer, Chats, $cordovaNativeAudio) {
  var canvas
  var timeout; 

  var playingAlert = false;

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

    load the alert sound
    $cordovaNativeAudio
    .preloadComplex('alert', 'audio/alert.mp3', 1, 1)
    .then(function (msg) {
      console.log(msg);
    }, function (error) {
      //alert(error);
      alert('Ready for training?');
    });
  });

  function playAlert() {
    $cordovaNativeAudio.loop('alert');
  };
  function stopAlert() {
    $cordovaNativeAudio.stop('alert');
  };


  //Start Watching method
  $scope.startWatching = function(newCount) {    
    Accelerometer.init(); 
    Accelerometer.startWatching();

    // Initiate count down timer
    $scope.count = newCount;
    //$scope.$apply();
    timeout = $scope.count * 1000;
    console.log("newCount is: " + newCount);
    console.log("timeout is: " + timeout);
    startTimer(timeout);
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
      face: ' '
    }
    Chats.add(score);

    console.log(Chats.all());

    stopAlert();
    playingAlert = false;
  };

  // For testing
  $scope.$watch('accelerometer.getMeasurements()', function(newMeasurements) {
    $scope.measurements = newMeasurements;
  });
  $scope.$watch('accelerometer.getRadius()', function(newRadius) {
    $scope.radius = $scope.measurementRound(newRadius, 2);
    if(newRadius > 16 && !playingAlert) {
      playAlert();
      playingAlert = true;
    } 
    if(newRadius < 16 && playingAlert) {
      stopAlert();
      playingAlert = false;
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

  // $scope.set = function() {
  //   $scope.count = 8;
  // }
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





.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})




.controller('AccountCtrl', function($scope, $cordovaNativeAudio) {
  $scope.settings = {
    enableFriends: true
  };

  // // load the alert sound
  //   $cordovaNativeAudio
  //   .preloadComplex('alert', 'audio/alert.mp3', 1, 1)
  //   .then(function (msg) {
  //     console.log(msg);
  //   }, function (error) {
  //     alert(error);
  //   });

  // $scope.playAlert = function() {
  //   $cordovaNativeAudio.loop('alert');
  // };
  // $scope.stopAlert = function() {
  //   $cordovaNativeAudio.stop('alert');
  // };
});
