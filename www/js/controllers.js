angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaDeviceMotion, $ionicPlatform, $interval, $timeout, Accelerometer) {
  var canvas
  var timeout = 100000; // 5 second timer

  $scope.count;

  $scope.radius;

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

    // Initialize variables
    $scope.count = 0;
  });

  //Start Watching method
  $scope.startWatching = function() {     
    Accelerometer.startWatching();

    // Reset timer
    if($scope.count < 1) {
      $scope.count = timeout/1000;
    }

    // Initiate count down timer
    startTimer(timeout);
  };  

  // Stop watching method
  $scope.stopWatching = function() {  
    Accelerometer.stopWatching();
    stopCountDown();
  };

  // For testing
  $scope.$watch('accelerometer.getMeasurements()', function(newMeasurements) {
    $scope.measurements = newMeasurements;
  });
  $scope.$watch('accelerometer.getRadius()', function(newRadius) {
    $scope.radius = newRadius;
  });
  $scope.$watch('accelerometer.getCurrentXWithRespectToOrigin()', function(newX) {
    $scope.currentXWithRespectToOrigin = newX;
  });
  $scope.$watch('accelerometer.getCurrentYWithRespectToOrigin()', function(newY) {
    $scope.currentYWithRespectToOrigin = newY;
  });

  $scope.measurementRound = function(measurement) {
    return precise_round(measurement, 5);
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
      $scope.count--;
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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
