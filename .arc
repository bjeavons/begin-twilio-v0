@app
local-bp3

@static

@http
get /foo
get /baz/:buzz

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
