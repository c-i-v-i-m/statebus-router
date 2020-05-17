# 0.0.1 -> 0.0.2
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

- 
