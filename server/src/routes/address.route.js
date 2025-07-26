import {Router} from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import { createAddress , disableAddress, getAddress, updateAddress } from '../controllers/address.controller.js'

const addressRoute = Router()

addressRoute.post('/add',auth,createAddress)
addressRoute.get('/get',auth,getAddress)
addressRoute.put('/update',auth,updateAddress)
addressRoute.post('/delete',auth,disableAddress)

export default addressRoute;