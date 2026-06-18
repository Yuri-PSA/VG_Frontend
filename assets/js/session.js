/* ================================ TOKEN JWT  ================================ */
const Session = (function() {
  let token = null;
  let user = null;

  return {
    // TOKEN
    setToken: function(newToken, newUser) {
      token = newToken;
    },

    getToken: function() {
      return token;
    },

    // USER
    setUser: function(newUser) {
      user = newUser;
    },

    getUser: function() {
      return user;
    },

    // CLEAN
    clearAll: function() {
      user = null;
      token = null;
    },
  };
})();
