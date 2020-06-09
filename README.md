# deno_rest_api_mongodb
This is a simple REST API using Deno and Oak and Mongodb.
This program also logs in and authenticates

See [My Blog](https://masalib.hatenablog.com/) for details

## Preparation

mongodb crate db 

crate collection products and user  
(You don't have to have 2 collections, 1 collection)

If you can't have a local environment.

sandbox Free Service [Mlab](https://mlab.com/)

See [My Blog](https://masalib.hatenablog.com/) for [Settings article](https://masalib.hatenablog.com/entry/2018/04/19/211340)


### env setting 

vi .env

sample
```
mongo_host=XXX.mlab.com
mongo_user=denouser
mongo_password=password
mongo_db=deno_db
mongo_products_collection=XXXX 
mongo_users_collection=XXXX
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
//No authentication

GET      /api/v1/products
GET      /api/v1/products/:id
POST     /api/v1/products
PUT      /api/v1/products/:id
DELETE   /api/v1/products/:id

//authentication
POST     /login
POST     /auth

//With certification(send it through Authorization header on every request.)
GET      /api/v2/products
GET      /api/v2/products/:id
POST     /api/v2/products
PUT      /api/v2/products/:id
DELETE   /api/v2/products/:id


```

## note 

- This program login and authenticates, but does not create any users.When creating user information, hashing and password are required.

```typescript
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
const hash = await bcrypt.hash("password");
console.log(hash)
```

- Because the plug-in API of Deno is still in an unstable state, the --unstable flag needs to be used. The minimum permissions required to run deno_mongo should be
```
INFO downloading deno plugin "deno_mongo" from "https://github.com/manyuanrong/deno_mongo/releases/download/v0.7.0/deno_mongo.dll"
```
