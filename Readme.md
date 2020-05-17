# statebus-router
`version: 0.0.2`

# What is statebus-router?
A lazy-man's front-end router for Statebus. 

# How to use it?

## Import the Router once in your project
```coffee
import 'statebus-router'
```


### Configure
Unless configured otherwise, users will be given the "guest" role, and redirected to "/".

*(Optional)* set a home page route and/or a default role by importing and calling the _configRouter_ function.

- _defaultRole_ is the role given to users when not logged in.
- _defaultRouteKey_ is the route users will be redirected to as a home page.

In the following example, users will be given the `user` role before being logged in, and the first thing they'll see is the contents of the `welcome` route.


```coffee
import { configRouter } from 'statebus-router/actions'

configRouter({
    defaultRouteKey: 'welcome',
    defaultRole: 'user'
})
```

## Add a route 
During your app's initialization, call _addRoute_ and pass it a **render** component.

For example, to respond to all requests for `/simple` with a SIMPLE_COMPONENT.

```coffee
import { addRoute } from 'statebus-router/actions'

addRoute('simple', {
    render: SIMPLE_COMPONENT,
}) 
```

### Authorization
You can add an authorization check to your route by defining the **authorize** function which will receive the state at `/user_permissions/{user.name}` though the `permissions` argument.

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

addRoute('item/:id', {
    render: ({id}) -> ITEM_COMPONENT(id)
})
```

It's possible to seperate route parameters.  `/item/:id/log/:logId`:

```coffee
addRoute('item/:id/log/:logId', {
    render: ({id, logId}) -> ITEM_COMPONENT(id, logId)
})
```

## Navigate
Use `<a>` tags.

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
