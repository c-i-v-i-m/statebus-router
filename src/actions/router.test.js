import { 
  getRouter,
  navigate, 
  getCurrentKey, 
  getCurrentPath, 
  parseLocationHref,
  // checkCurrentLocation, @TODO: check call to navigate
  // handlePopState, @TODO: check call to navigate (need to trigger popstate)
  addRoute,
  authorizeRoute,
  getPropertiesFromPath
} from './index.coffee'

import mockState from '../utils/mockState';

describe('Router', () => {
  beforeEach(() => {
    mockState();
  });

  afterEach(() => {
    window.states = {};
  });

  describe('getRouter', () => {
    it("Default route is \"list\"", () => {
      const router = getRouter()
      expect(router.currentRoute).to.equal("list")
      expect(router.currentPath).to.equal(null)
    });
    it("Defaults with empty routes object", () => {
      const router = getRouter()
      expect(Object.keys(router.routes).length).to.equal(0)
    });
  });

  describe('getCurrentKey', () => {
    it("default route is \"list\"", () => {
      const currentKey = getCurrentKey()
      expect(currentKey).to.equal("list")
    });
  });

  describe('getCurrentPath', () => {
    it("default path is null", () => {
      const currentPath = getCurrentPath()
      expect(currentPath).to.equal(null)
    });
  });

  describe('addRoute', () => {
    it("Add new route", () => {
      var router = addRoute('key', {value: 'testRoute'});
      expect(router.routes['key'].value).to.equal('testRoute');
    });
  
    it("Doesnt overwrite route", () => {
      addRoute('key', {value: 'testRoute'});
      var router2 = addRoute('key', {value: 'testRoute2'});
      expect(router2.routes['key'].value).to.equal('testRoute');
    });
  });

  describe('navigate', () => {
    afterEach(() => {
      states = {};
    });
    it("Throws invalid", () => {
      expect(() => {
        navigate('invalid', 'route')
      }).to.throw('Invalid route.')
    });

    describe('Without Path', () => {
      it("Updates location", () => {
        addRoute('key', {value: 'test'});
        const newLocation = navigate('key', null);
        var hashPath = newLocation.href.split('#')[1];
        expect(hashPath).to.equal('key');
      });
  
      it("Updates router", () => {
        addRoute('key', {value: 'test'});
        navigate('key', null);
        const currentKey = getCurrentKey();
        const currentPath = getCurrentPath();
        expect(currentKey).to.equal('key');
        expect(currentPath).to.equal(null);
      });
    });

    describe('With Path', () => {
      it("Updates location", () => {
        addRoute('key', {value: 'test'});
        const newLocation = navigate('key', '/route');
        var hashPath = newLocation.href.split('#')[1];
        expect(hashPath).to.equal('key/route');
      });
  
      it("Updates router", () => {
        addRoute('key', {value: 'test'});
        navigate('key', '/route');
        const currentKey = getCurrentKey();
        const currentPath = getCurrentPath();
        expect(currentKey).to.equal('key');
        expect(currentPath).to.equal('/route');
      });
    });
  });

  describe('parseLocationHref', () => {
    describe('No hash returns default', () => {
      it("tld ending", () => {
        const newRoute = parseLocationHref('http://domain.tld')
        expect(newRoute.key).to.equal('list')
        expect(newRoute.path).to.equal(null)
      })
  
      it("\"/\" ending", () => {
        const newRoute = parseLocationHref('http://domain.tld/')
        expect(newRoute.key).to.equal('list')
        expect(newRoute.path).to.equal(null)
      });
    });

    describe('Gets key from hash', () => {
      it("tld ending", () => {
        const newRoute = parseLocationHref('http://domain.tld#test')
        expect(newRoute.key).to.equal('test')
        expect(newRoute.path).to.equal(null)
      });

      it("\"/\" ending", () => {
        const newRoute = parseLocationHref('http://domain.tld/#test')
        expect(newRoute.key).to.equal('test')
        expect(newRoute.path).to.equal(null)
      });
   });


    describe('Gets key and path from hash', () => {
      describe("Simple path", () => {
        it("tld ending", () => {
          const newRoute = parseLocationHref('http://domain.tld#test/path')
          expect(newRoute.key).to.equal('test')
          expect(newRoute.path).to.equal('/path')
        });
    
        it("\"/\" ending", () => {
          const newRoute = parseLocationHref('http://domain.tld/#test/path')
          expect(newRoute.key).to.equal('test')
          expect(newRoute.path).to.equal('/path')
        });
      });

      describe("Complex path", () => {
        it("tld ending", () => {
          const newRoute = parseLocationHref('http://domain.tld#test/path/two')
          expect(newRoute.key).to.equal('test')
          expect(newRoute.path).to.equal('/path/two')
        });
    
        it("\"/\" ending", () => {
          const newRoute = parseLocationHref('http://domain.tld/#test/path/two')
          expect(newRoute.key).to.equal('test')
          expect(newRoute.path).to.equal('/path/two')
        });
      });
    })
  })


  describe('getPropertiesFromPath', () => {
      describe("Simple path", () => {
        var template = '/path/:id';
        it("Maps value to properties object", () => {
          const properties = getPropertiesFromPath('/path/200', template)
          expect(properties['id']).to.equal('200')
          expect(Object.keys(properties).length).to.equal(1)
        });

        it("Handles missing value", () => {
          const properties = getPropertiesFromPath('/path', template)
          expect(properties['id']).to.equal(undefined)
          expect(Object.keys(properties).length).to.equal(0)
        });

        it("Handles invalid path", () => {
          expect(() => {
            const properties = getPropertiesFromPath('/wrongPath', template)
          }).to.throw('Invalid path.');
        });
      });

      describe("Complex path", () => {
        var template = '/path/:id/:version';
        it("Maps value to properties object", () => {
          const properties = getPropertiesFromPath('/path/200/999', template)
          expect(properties['id']).to.equal('200')
          expect(properties['version']).to.equal('999')
          expect(Object.keys(properties).length).to.equal(2)
        });

        it("Handles one missing value", () => {
          const properties = getPropertiesFromPath('/path/200', template)
          expect(properties['id']).to.equal('200')
          expect(properties['version']).to.equal(undefined)
          expect(Object.keys(properties).length).to.equal(1)
        });

        it("Handles two missing values", () => {
          const properties = getPropertiesFromPath('/path', template)
          expect(properties['id']).to.equal(undefined)
          expect(properties['version']).to.equal(undefined)
          expect(Object.keys(properties).length).to.equal(0)
        });
      });

      describe("Complex path with non-property segment", () => {
        var template = '/path/:id/version/:version';
        it("Maps value to properties object", () => {
          const properties = getPropertiesFromPath('/path/200/version/999', template)
          expect(properties['id']).to.equal('200')
          expect(properties['version']).to.equal('999')
          expect(Object.keys(properties).length).to.equal(2)
        });

        it("Handles one missing value", () => {
          const properties = getPropertiesFromPath('/path/200/version', template)
          expect(properties['id']).to.equal('200')
          expect(properties['version']).to.equal(undefined)
          expect(Object.keys(properties).length).to.equal(1)
        });

        it("Handles two missing values", () => {
          const properties = getPropertiesFromPath('/path', template)
          expect(properties['id']).to.equal(undefined)
          expect(properties['version']).to.equal(undefined)
          expect(Object.keys(properties).length).to.equal(0)
        });

        it("Handles invalid path", () => {
          expect(() => {
            const properties = getPropertiesFromPath('/path/:id/not_version/:version', template)
          }).to.throw('Invalid path.');
          expect(() => {
            const properties = getPropertiesFromPath('/not_path/:id/version/:version', template)
          }).to.throw('Invalid path.');
        });
      });
  });

  describe('Authorize', () => {
      afterEach(() => {
        states = {};
      });
      describe('Authorization function', () => {
        it("Always returns true without authorize option", () => {
          expect(authorizeRoute({})).to.equal(true)
        });

        it("If not logged in, assumes default permissions", () => {
          save({key: '/current_user'})
          const authorizationFn = (permissions) => {
            return permissions.roles.indexOf('list') > -1; //@TODO: default permission config (consts)
          }

          expect(authorizeRoute({
            authorize: authorizationFn
          })).to.equal(true);
        })

        it("If logged in but no user, assumes default permissions", () => {
          save({key: '/current_user', logged_in: true})
          expect(authorizeRoute({
            authorize: function(permissions) {
              return permissions.roles.indexOf('list') > -1; //@TODO: default permission config (consts)
            }
          })).to.equal(true);
        })

        it("Logged in with /user_permissions/ unauthorized", () => {
          save({key: '/current_user', logged_in: true, user: {name: 'test'}})
          save({key: '/user_permissions/test', roles: ['no_authorized']});

          expect(authorizeRoute({
            authorize: function(permissions) {
              return permissions.roles.indexOf('authorized') > -1;
            }
          })).to.equal(false);
        })

        it("Logged in with /user_permissions/ authorized", () => {
          save({key: '/current_user', logged_in: true, user: {name: 'test'}})
          save({key: '/user_permissions/test', roles: ['authorized']});

          expect(authorizeRoute({
            authorize: function(permissions) {
              return permissions.roles.indexOf('authorized') > -1;
            }
          })).to.equal(true);
        });
      });

      describe('Role definition', () => {
        it("Returns true without authorize option", () => {
          expect(authorizeRoute({})).to.equal(true)
        });

        it("If not logged in, assumes default permissions", () => {
          save({key: '/current_user'})
          const authorizedRoles = ['list'] // @TODO: default permission config (consts)
          expect(authorizeRoute({ authorizedRoles })).to.equal(true);
        });

        it("If logged in but no user, assumes default permissions", () => {
          save({key: '/current_user', logged_in: true})

          const authorizedRoles = ['list'] // @TODO: default permission config (consts)
          expect(authorizeRoute({ authorizedRoles })).to.equal(true);
        })

        
        it("Logged in with /user_permissions/ blocks default if not in user roles", () => {
          save({key: '/current_user', logged_in: true, user: {name: 'test'}})
          save({key: '/user_permissions/test', roles: ['not_list']});

          const authorizedRoles = ['list'] // @TODO: default permission config (consts)
          expect(authorizeRoute({ authorizedRoles })).to.equal(false);
        });


        it("Logged in with /user_permissions/ unauthorized", () => {
          save({key: '/current_user', logged_in: true, user: {name: 'test'}})
          save({key: '/user_permissions/test', roles: ['no_authorized']});

          const authorizedRoles = ['notDefault']
          expect(authorizeRoute({ authorizedRoles })).to.equal(false);
        });

        it("Logged in with /user_permissions/ authorized", () => {
          save({key: '/current_user', logged_in: true, user: {name: 'test'}})
          save({key: '/user_permissions/test', roles: ['authorized']});

          const authorizedRoles = ['authorized'] // @TODO: default permission config (consts)
          expect(authorizeRoute({ authorizedRoles })).to.equal(true);
        });
      });
  });
});
