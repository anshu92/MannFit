angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaDeviceMotion, $ionicPlatform, Accelerometer) {
  var canvas;

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
  });

  //Start Watching method
  $scope.startWatching = function() {     
    Accelerometer.startWatching();
  };  

  // Stop watching method
  $scope.stopWatching = function() {  
    Accelerometer.stopWatching();
  };

  // For testing
  $scope.$watch('accelerometer.getMeasurements()', function(newMeasurements) {
    $scope.measurements = newMeasurements;
  });
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
