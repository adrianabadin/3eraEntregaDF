import dotenv from 'dotenv'
import mongoose,{Schema} from 'mongoose'
import logger from '../helper/LoggerConfig.js'
import { CartSchema } from './Schemas.js'
dotenv.config()
//const objectLogger = require('../configurations/log4js.config')
//const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
await mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => logger.info.info('Mongo Connected'))
const UserSchema = new Schema({
    nombre:{type:String},
    apellido:{type:String},
    edad:{type:Number},
    phone:{type:String},
    adress:{type:String},
    avatar:{type:String},
    carts:[{type:String}]
  })
export default UserSchema
