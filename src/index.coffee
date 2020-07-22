import * as actions from './actions'

export initRouter = () ->
    if !dom.ROUTER 
        dom.ROUTER = () ->
            router = actions.getRouter()
            if !router.routes[router.currentRoute]
                return 'Invalid route.'

            if !actions.authorizeRoute(router.routes[router.currentRoute])
                if router.unauthorizedComponent 
                    return router.unauthorizedComponent()
                else 
                    return 'Unauthorized.'

            return router.routes[router.currentRoute].render(
                actions.getPropertiesFromPath(router.currentPath, router.routes[router.currentRoute].routeTemplate),
                router.currentPath
            )
        actions.checkCurrentLocation()
        window.onpopstate = actions.handlePopState
    else 
        console.warn('Statebus-Router already initialized.')

export * from './actions'
