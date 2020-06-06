# deno_rest_api_mongodb
This is a simple REST API using Deno and Oak and Mongodb

[My Blog](https://masalib.hatenablog.com/)

## Preparation

mongodb crate db and collection

If you can't have a local environment
sandbox Free Service [Mlab](https://mlab.com/)
[Settings article](https://masalib.hatenablog.com/entry/2018/04/19/211340)


### env setting 

vi .env

sample
```
mongo_host=XXX.mlab.com
mongo_user=denouser
mongo_password=password
mongo_db=deno_db
mongo_collection=denocollection 
mongo_port=nnnnn
```

### denon install
```
deno install --allow-read --allow-run --allow-write -f --unstable https://deno.land/x/denon/denon.ts
```


## Run
```
denon start
```

## Routes
```
GET      /api/v1/products
GET      /api/v1/products/:id
POST     /api/v1/products
PUT      /api/v1/products/:id
DELETE   /api/v1/products/:id
```

## note 

Because the plug-in API of Deno is still in an unstable state, the --unstable flag needs to be used. The minimum permissions required to run deno_mongo should be
```
INFO downloading deno plugin "deno_mongo" from "https://github.com/manyuanrong/deno_mongo/releases/download/v0.7.0/deno_mongo.dll"
```
