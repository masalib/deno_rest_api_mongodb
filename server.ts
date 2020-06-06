import {Application,Router} from "https://deno.land/x/oak/mod.ts";
import router from './routes.ts'

const port = Deno.env.get("PORT") as string || 8000
const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())
console.log(`Server Running on port ${port}`)
await app.listen({port: +port })