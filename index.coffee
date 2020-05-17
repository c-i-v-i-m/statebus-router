import { 
    getRouter,
    authorizeRoute,
    getPropertiesFromPath
} from './src/actions'

dom.ROUTER = () ->
    router = getRouter()
    if !router.routes[router.currentRoute]
        return 'Invalid route.'
    if !authorizeRoute(router.routes[router.currentRoute])
        return 'Unauthorized.'

    return router.routes[router.currentRoute].render(
        getPropertiesFromPath(router.currentPath, router.routes[router.currentRoute].routeTemplate),
        router.currentPath
    )
