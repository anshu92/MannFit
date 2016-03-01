angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  var prScore = 999999;
  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Pushup',
    lastText: 'Score: 3020.32',
    face: 'img/ben.png',
  }, {
    id: 1,
    name: 'Pushup',
    lastText: 'Score: 4080.22',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Plank',
    lastText: 'Score: 5019.55',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Squat',
    lastText: 'Score: 2004.37',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Plank',
    lastText: 'Score: 187.44',
    face: 'img/mike.png',
    pr: true
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    },
    getLastId: function() {
      return chats.length - 1;
    },
    add: function (chat) {
      chats.push(chat);
    },
    getPr: function() {
      return prScore;
    },
    setPr: function(newPr) {
      this.prScore = newPr;
    }
  };
});
