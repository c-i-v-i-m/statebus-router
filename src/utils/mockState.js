const mockState = (initState = {}) => {
    window.states = initState;

    window.fetch = function(key) {
      if (!window.states[key]) {
        return {
          key: key
        };
      }
      return {
          ...window.states[key],
          key: key
      };
    };
    
    window.save = function(object) {
        window.states[object.key] = object;
      return object;
    };

    window.setTimeout = function(fn, ms) {
      // @NOTE: don't wait for timeout, run immediately
      fn()
    }

    return states;
};

export default mockState;