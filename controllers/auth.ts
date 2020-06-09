import { config } from "https://deno.land/x/dotenv/mod.ts";
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt/create.ts"
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import { Context } from "https://deno.land/x/oak/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import  mongodb  from '../mongodb.ts'

//DBの設定
const db = mongodb

//環境変数
const ENV_PATH = '.env';//deno runしたところをカレントディレクトリになるみたい
const config_env:any = config({ path: ENV_PATH });
const collection_name:string = config_env.mongo_users_collection
const datas = db.collection(collection_name)


const key = "xxxxxxsome-random-secret-keyxxxxxxxxx";
const header: Jose = {
  alg: "HS256",
  typ: "JWT",
}

// @desc    login 
// @route   POST /login
const login = async ({ request, response }: { request: any , response: any }) => {
  if (!request.hasBody){
    response.status = 400
    response.body = {
      success: false,
      msg: 'No Data'
    } 
  }else {
    const body = await request.body()
    //console.log(body)
    //console.log(body.value.username)
    //console.log(body.value.password)

    //const hash = await bcrypt.hash(body.value.password);
    //console.log(hash)

    const data = await datas.find({ "username": body.value.username });
    //判定が微妙な感じ・・・
    if ( data.toString() ===""){
      console.log("mongodb no data")
      response.status = 422;
      response.body = {
        message: 'Invalid username or password'
      };
    } else {
      //ループでもってくる以外のやり方がわからずこの形になった
      for (var it in data)
      {
        const item = data[it]
        var db_password =  item.password
        var db_id =  item.id
      }
  
      if (await bcrypt.compare(body.value.password, db_password)) {
        const payload: Payload = {
        iss: body.value.username,
        exp: setExpiration(new Date().getTime() + 3600000),
        }
        // Create JWT and send it to user
        const jwt = makeJwt({key, header, payload});
        if (jwt) {
          response.status = 200;
          response.body = {
            id: db_id,
            username: body.value.username,
            jwt,
          }
        } else {
          response.status = 500;
          response.body = {
            message: 'Internal server error'
          }
        }
        return;
      } else {
        console.log("password compare false")
        response.status = 422;
        response.body = {
          message: 'Invalid username or password'
        };
      }
    }
  }  
}


// @desc    auth
// @route   POST /auth
const auth = async ({ request, response }: { request: any , response: any }) => {
  response.status = 200
  response.body = {
    success: true,
    data:"auth success"
  }
}


const authMiddleware = async (ctx: Context, next: any) => {

  console.log("authMiddleware start")

  const headers: Headers = ctx.request.headers;
  // Taking JWT from Authorization header and comparing if it is valid JWT token, if YES - we continue, 
  // otherwise we return with status code 401
  const authorization = headers.get('Authorization')
  //console.log("authMiddleware authorization:" + authorization)

  if (!authorization) {
    console.log("authorization Noting" )
    ctx.response.status = 401;
    return;
  }
  const jwt = authorization.split(' ')[1];
  console.log("jwt:" + jwt )
  if (!jwt) {
    console.log("jwt Noting" )
    ctx.response.status = 401;
    return;
  }

  if (await validateJwt(jwt, key, {isThrowing: false})){
    await next();
    return;
  }
  console.log("validateJwt false" )

  ctx.response.status = 401;
  ctx.response.body = {message: 'Invalid jwt token'};
}

export {login ,auth,authMiddleware}
