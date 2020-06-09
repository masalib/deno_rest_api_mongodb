import { config } from "https://deno.land/x/dotenv/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.7.0/mod.ts";

//環境変数
const ENV_PATH = '.env';//deno runしたところをカレントディレクトリになるみたい
const config_env:any = config({ path: ENV_PATH });
const user:string = config_env.mongo_user
const password_data:string = config_env.mongo_password
const host:string = config_env.mongo_host
const port_num:number = config_env.mongo_port
const db_name:string = config_env.mongo_db
//mongodb://<dbuser>:<dbpassword>@<host>:<port>/<db>
const url:string = 'mongodb://' + user + ':' + password_data + '@' + host + ':' + port_num + '/' + db_name

//mongoDB接続
console.log("mongodb connection start")
const client_mongodb = new MongoClient()
client_mongodb.connectWithUri(url)

//DBの設定
const mongodb = client_mongodb.database(db_name)

export default mongodb;
