# statebus-router
`version: 0.0.1`

# What is statebus-router?
A lazy-man's front-end router for Statebus. 

# How to use it?

## Import the Router once in your project
```coffee
import 'statebus-router'
```

## Add a route 
During your app's initialization, call `addRoute` and pass it a **render** component.

For example, to respond to all requests for /simple with a SIMPLE_COMPONENT.

```coffee
import { addRoute } from 'statebus-router/actions'

addRoute('simple', {
    render: SIMPLE_COMPONENT,
}) 
```

### Authorization
You can add an authorization check to your route by defining the **authorize** function which will receive the state at `/user_permissions/{user.name}` though the _permissions_ argument.

```coffee
addRoute('authorized', {
    render: AUTHORIZED_COMPONENT,
    authorize: (permissions) ->
        if !permissions || !permissions.roles then return false
        return permissions.roles.includes('authorized_role')
})
```

### Extract parameters from a request path by using the ":" prefix.

In the following example, requests for `/item/23` would be passed to ITEM_COMPONENT(23) because of the mapping through `/item/:id`.

```coffee
import { 
    addRoute, 
    getPropertiesFromPath
} from 'statebus-router/actions'

addRoute('item', {
    render: (path) ->
        properties = {}
        if (path)
            properties = getPropertiesFromPath(path, '/:id')
        ITEM_COMPONENT(properties.id)
})
```

It's possible to seperate route parameters.  `/item/:id/log/:logId`:

```coffee
addRoute('item', {
    render: (path) ->
        properties = {}
        if (path)
            properties = getPropertiesFromPath(path, '/:id/log/:logId')
        ITEM_COMPONENT(properties.id, properties.logId)
})
```


### Notice regarding changes to _addRoute_ 
In the future, route parameters will be declared in the first _addRoute_ argument. 

As such, the last example will become:

```coffee
addRoute('item/:id/log/:logId', {
    render: ({id, logId}, path) ->
        ITEM_COMPONENT(id, logId)
})
```

Or, after wrapping ITEM_COMPONENT in a route component and adding authentication:

```coffee
addRoute('item/:id/log/:logId', {
    render: ITEM_COMPONENT_ROUTE,
    authorize: (permissions) ->
        if !permissions || !permissions.roles then return false
        return permissions.roles.includes('authorized_role')
})
```

## Navigate
Use <a> tags.

.
.
.
That's it really.
.
.
.
.
.
.
.
.
.
.
.
.

# About ci.V:im
https://civim.org

# About Statebus
https://stateb.us
