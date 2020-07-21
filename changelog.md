# 0.1.3
- Cleanup npm files

# 0.1.2
- HandlePopState shouldn't attach to window.onpopstate

# 0.1.1
- Build with libraryTarget

# 0.1.0
- Publish Javascript (not coffeescript) component + actions
    - Removes need for complex webpack setup to user statebus-router, no need to import from /actions

# 0.0.7
- Upgrade packages (fix security vulnerability in lodash < 4.17.19)

# 0.0.6
- Improve handlePopState / navigate

# 0.0.5
- Actual, comprehensive, dependency cleanup
- Export navigate from /actions

# 0.0.4
- Added unauthorizedComponent property to configRouter

# 0.0.3
- Update package dev depencies.
- npmignore eslintrc
- Update readme

# 0.0.2
- Updated api for route definition, to pass path properties as well as path to render function.

From:
```coffee
addRoute('item', {
    render: (path) ->
        properties = {}
        if (path)
            properties = getPropertiesFromPath(path, '/:id/log/:logId')
        ITEM_COMPONENT(properties.id, properties.logId)
})
```


To:
```coffee
addRoute('item/:id/log/:logId', {
    render: ({id, logId}, path) ->
        ITEM_COMPONENT(id, logId)
})
```

- Don't export navigate 
