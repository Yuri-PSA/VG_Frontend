/* ================================ TOKEN JWT  ================================ */
const Session = (function() {
  let token = null;

  return {
    setToken: function(newToken) {
      token = newToken;
      localStorage.setItem('jwt', newToken);
    },
    getToken: function() {
      if (token) return token;
      const stored = localStorage.getItem('jwt');
      if (stored) {
        token = stored;
        return token;
      }
      return null;
    },
    clearToken: function() {
      token = null;
      localStorage.removeItem('jwt');
    }
  };
})();