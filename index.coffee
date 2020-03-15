import { 
    getRouter,
    authorizeRoute
} from './src/actions'

dom.ROUTER = () ->
    router = getRouter()

    if !router.routes[router.currentRoute]
        return 'Invalid route.'
    if !authorizeRoute(router.routes[router.currentRoute])
        return 'Unauthorized.'

    return router.routes[router.currentRoute].render(router.currentPath)
