const Session = (function() {
  let token = null;
  let user = null;
  let esJefe = null;
  let rol = null;

  return {
    setToken: function(newToken) {
      token = newToken;
      sessionStorage.setItem('jwt', newToken);
    },

    getToken: function() {
      if(token) return token;
      const storedT = sessionStorage.getItem('jwt');
      if(storedT) {
        token = storedT;
        return token;
      }
      return null;
    },

    setUser: function(newUser) {
      user = newUser;
      sessionStorage.setItem('user', newUser);
    },

    getUser: function() {
      if(user) return user;
      const storedU = sessionStorage.getItem('user');
      if(storedU) {
        user = storedU;
        return user;
      }
      return null;
    },

    setJefe: function(val) {
      esJefe = val;
      sessionStorage.setItem('es_jefe', val ? 'true' : 'false');
    },

    getJefe: function() {
      if(esJefe !== null) return esJefe;
      const stored = sessionStorage.getItem('es_jefe');
      if(stored !== null) { 
        esJefe = stored === 'true'; 
        return esJefe; 
      }
      return false;
    },

    setRol: function(newRol) {
      rol = newRol;
      sessionStorage.setItem('rol', newRol);
    },

    getRol: function() {
      if(rol) return rol;
      const stored = sessionStorage.getItem('rol');
      if(stored) {
        rol = stored;
        return rol;
      }
      return null;
    },

    clearAll: function() {
      user = null;
      token = null;
      esJefe = null;
      rol = null;
      sessionStorage.removeItem('jwt');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('es_jefe');
      sessionStorage.removeItem('rol');
    },
  };
})();