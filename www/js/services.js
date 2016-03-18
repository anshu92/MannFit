angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  var prScore = 999999;
  // Some fake testing data
  var chats = [];

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
