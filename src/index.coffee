import * as actions from './actions'

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

export default dom.ROUTER
export * from './actions'
