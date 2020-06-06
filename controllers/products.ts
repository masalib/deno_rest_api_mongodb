import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.7.0/mod.ts";
import { Product } from '../types.ts'

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
const client = new MongoClient()
client.connectWithUri(url)

//DBの設定
const db = client.database(db_name)

//コレクションの設定
const collection_name:string = config_env.mongo_collection
const datas = db.collection(collection_name)


// @desc    Get all products
// @route   GET /api/v1/products
const getProducts = async({ response }: { response: any }) => {
  try{
    const data = await datas.find();
    //判定が微妙な感じ・・・
    if ( data.toString() ===""){
      response.status = 404
      response.body = {
        success: false,
        msg: 'No Product found'
      }
    } else {
      response.body = {
          success: true,
          data: data
      }
    }
  } catch(error){
    response.status = 500
    response.body = {
      success: false,
      msg: 'Server Error'
    }
  }
}



// @desc    Get single product
// @route   GET /api/v1/products/:id
const getProduct = async({ params ,response }: { params:{id :string },response: any }) => {
  try{
    const data = await datas.find({ "id": params.id });
    //console.log(params.id)
  
    //判定が微妙な感じ・・・
    if ( data.toString() ===""){
      response.status = 404
      response.body = {
        success: false,
        msg: 'No Product found'
      }
    } else {
      response.status = 200
      response.body = {
        success: true,
        data:data
      }
    }
  } catch (error){
    response.status = 500
    response.body = {
      success: false,
      msg: 'Server Error'
    }
  } 
}



// @desc    Add product
// @route   POST /api/v1/products
/*
  json sample
  {
 	"name": "Product1_add",
    "description": "description1_add",
    "price": 200
  }
*/
const addProduct = async ({ request, response }: { request: any , response: any }) => {
  const body = await request.body()

  if (!request.hasBody){
    response.status = 400
    response.body = {
      success: false,
      msg: 'No Data'
    } 
  }else {

    //バリデーション・・・省略
    const product: Product = body.value
    product.id = v4.generate()
    try{
      const insertId = await datas.insertOne(product);
      const product_data = await datas.findOne({ _id: insertId });//$oidを表示するため

      if ( product_data.toString() ===""  ){
        response.status = 400
        response.body = {
          success: false,
          msg: 'Insert false'
        } 
      } else {
        response.status = 200
        response.body = {
          success: true,
          data: product_data
        }
      }
    } catch(error){
      response.status = 500
      response.body = {
        success: false,
        msg: 'Server Error'
      } 
  
    }  
  }
}

// @desc    Update product
// @route   PUT /api/v1/products/:id
const updateProduct = async({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
  //console.log("params.id:"+ params.id)
  //console.log("updateProduct")

  const body = await request.body()

  if (!request.hasBody){
    response.status = 400
    response.body = {
      success: false,
      msg: 'No Data'
    } 
  }else {
    //バリデーション・・・省略
    const product: Product = body.value
    product.id = params.id
  
    try{
      const { matchedCount, modifiedCount, upsertedId } = await datas.updateOne(
        { "id": params.id },
        { $set: { 
          "name": product.name,
          "description": product.description,
          "price": product.price
          } }
      );
      console.log("upsertedId:" + upsertedId) //NULLがセット？？どうやったらセットされるのか不明
      console.log("matchedCount:" + matchedCount) 
      console.log("modifiedCount:" + modifiedCount)
      const data = await datas.find({ "id": params.id }); //$oidを表示するため

      //成功時には{ matchedCount 1, modifiedCount 1 }が返ってくる。もう少し欲しいけど・・・
      if (matchedCount ===1 &&  modifiedCount ===1  ){
        response.status = 200
        response.body = {
          success: true,
          data: data
        }
      } else {
        response.status = 404
        response.body = {
          success: false,
          msg: 'No product found'
        } 
      }
    } catch(error){
      response.status = 500
      response.body = {
        success: false,
        msg: 'Server Error'
      } 
    }  
  }
}

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
const deleteProduct = async({ params, response }: { params: { id: string }, response: any }) => {

  if (params.id ===""){
    response.status = 400
    response.body = {
      success: false,
      msg: 'No Data'
    } 
  }else {

    //バリデーション・・・省略
    try{
      const data = await datas.find({ "id": params.id });
      //console.log(params.id)
    
      //判定が微妙な感じ・・・
      if ( data.toString() ===""){
        response.status = 404
        response.body = {
          success: false,
          msg: 'No Product found'
        }
      } else{
        //const deleteCount = await datas.deleteOne({ "id": params.id }); mongodbのIDじゃないといけないのか？わからないのでmanyに変更
        const deleteCount = await datas.deleteMany({ "id": params.id });
        //console.log(deleteCount)
        //成功時には{ deleteCount 1 }が返ってくる。もう少し欲しいけど・・・
        if (deleteCount ===1 ){
          response.status = 200
          response.body = {
            success: true,
            msg: 'Product removed'
          }
        } else {
          response.status = 404
          response.body = {
            success: false,
            msg: 'No product found'
          } 
        }
      }

    } catch(error){
      response.status = 500
      response.body = {
        success: false,
        msg: 'Server Error'
      } 
    }  
  }
}


export {getProducts ,getProduct,addProduct,updateProduct ,deleteProduct}

