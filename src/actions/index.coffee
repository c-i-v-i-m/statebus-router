_DEFAULT_ROUTE_KEY = ''
_DEFAULT_ROLE = 'guest'

export configRouter = ({
    defaultRole, 
    defaultRouteKey,
    unauthorizedComponent
}) ->
    router = getRouter()
    if defaultRole
        _DEFAULT_ROLE = defaultRole

    if defaultRouteKey
        _DEFAULT_ROUTE_KEY = defaultRouteKey

    if unauthorizedComponent
        router.unauthorizedComponent = unauthorizedComponent

export getRouter = () ->
    router = fetch('_router')
    router.routes or= {}
    router.currentRoute or= _DEFAULT_ROUTE_KEY
    router.currentPath or= null
    return router

authorizeByFn = (routeOptions) ->
    permissions = {roles: []}

    if fetch('/current_user').logged_in
        user = fetch('/current_user').user
        if (user) 
            permissions = fetch('/user_permissions/'+user.name)
    
    if !permissions.roles || !permissions.roles.length 
        permissions = {roles: [_DEFAULT_ROLE]}

    return routeOptions.authorize(permissions)

authorizeByRoles = (routeOptions) ->
    permissions = {roles: []}

    if fetch('/current_user').logged_in
        user = fetch('/current_user').user
        if (user) 
            permissions = fetch('/user_permissions/'+user.name)
    
    if !permissions.roles.length
        permissions = {roles: [_DEFAULT_ROLE]}

    authorized = false
    i = 0

    while !authorized && routeOptions.authorizedRoles[i]
        if permissions.roles.indexOf(routeOptions.authorizedRoles[i]) > -1
            authorized = true
        i++

    return authorized

export authorizeRoute = (routeOptions) ->
    if !routeOptions.authorize && !routeOptions.authorizedRoles
        return true

    if routeOptions.authorize
        return authorizeByFn(routeOptions)
    else
        return authorizeByRoles(routeOptions)

export getCurrentKey = () ->
    router = fetch('_router')
    router.currentRoute or= _DEFAULT_ROUTE_KEY
    return router.currentRoute

export getCurrentPath = () ->
    router = fetch('_router')
    router.currentPath or= null
    return router.currentPath

# Register a route
export addRoute = (key, options) ->
    split = key.split('/')
    key_root = split[0]
    template = ''
    if split.length > 1
        template = split.slice(1).join('/')

    router = fetch('_router')
    router.routes or= {}

    if !router.routes[key_root]
        router.routes[key_root] = options
        router.routes[key_root].routeTemplate = template
        save(router)

    return router;

# Change route
export navigate = (key, path) ->
    # Should probably not be calling navigate. Use href anchors or set window.location.
    router = fetch('_router')
    router.routes or= {}
    if !router.routes[key]
        throw(new Error('Invalid route.'))

    currentKey = getCurrentKey()
    currentPath = getCurrentPath()
    if key != currentKey || path != currentPath
        newLocation = window.location.pathname + '#'+key

        if path
            newLocation += path
            router.currentPath = path
        else
            router.currentPath = null

        router.currentRoute = key
        setTimeout(() ->
            save(router)
        , 1) #@NOTE: wish we didn't have to do this...

    return window.location


export getPropertiesFromPath = (path, template) -> 
    if !path then return {}
    if !template.length then return {}

    templateSegments = template.split('/').filter((s) -> s.length)
    pathSegments = path.split('/').filter((s) -> s.length)

    properties = pathSegments.reduce((r, pSegment, idx) ->
        if (templateSegments[idx][0] != ':' && pSegment != templateSegments[idx])
            #not a property but text doesn't match...
            throw(new Error("Invalid path."))
        else if templateSegments[idx][0] == ':'
            # we found a property, map it!
            r[templateSegments[idx].split(':')[1]] = pSegment
            return r
        else
            return r 
    , {})
    return properties

export parseLocationHref = (href) -> 
    if !href || href.indexOf('#') == -1
        return {
            key: _DEFAULT_ROUTE_KEY,
            path: null
        }

    route = href.split('#')[1]
    newKey = route.split('/')[0]
    path = route.split('/').slice(1).join('/')
    newPath = null
    
    if path
        newPath = '/'+path

    return {
        key: newKey,
        path: newPath
    }

export checkCurrentLocation = () ->
    newRoute = parseLocationHref(window.location.href)
    return navigate(newRoute.key, newRoute.path)

export handlePopState = () ->
    window.onpopstate = (event) ->
        newRoute = parseLocationHref(window.location.href)
        navigate(newRoute.key, newRoute.path)
