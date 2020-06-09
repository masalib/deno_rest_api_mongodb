import {Router} from "https://deno.land/x/oak/mod.ts";
import {getProducts,getProduct, addProduct, updateProduct, deleteProduct} from './controllers/products.ts'
import {login,auth,authMiddleware} from './controllers/auth.ts'

const router = new Router()
router.get('/api/v1/products', getProducts )
    .get('/api/v1/products/:id', getProduct )
    .post('/api/v1/products', addProduct )
    .put('/api/v1/products/:id', updateProduct )
    .delete('/api/v1/products/:id', deleteProduct )


router.get('/api/v2/products', authMiddleware, getProducts )
    .get('/api/v2/products/:id', authMiddleware, getProduct )
    .post('/api/v2/products', authMiddleware, addProduct )
    .put('/api/v2/products/:id', authMiddleware, updateProduct )
    .delete('/api/v2/products/:id', authMiddleware, deleteProduct )


    router.post('/login', login )
    .post('/auth', authMiddleware,auth )


export default router