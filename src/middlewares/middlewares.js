//IMPORTS
import Session from "express-session"
import pkg from "passport-fast-config"
import MongoStore from "connect-mongo"
import dotenv from "dotenv"
import flash from "connect-flash"
import UserSchema from "../models/userSchema.js"
import morgan from "morgan"
import {morganWinston} from "../helper/CustomMorgan.js"
import {handleConfig} from "../configurations/handlebarsConfig.js"
import passport from "passport"
import {schema,root} from "../routes/graphql.js"
import { graphqlHTTP } from "express-graphql"
import mongoose,{Schema} from "mongoose"
const passportConfigBuilder=pkg.default
console.log(passportConfigBuilder)
//import {routes} from "../routes/routes.js"
//import login from "../routes/login.js"
import routes from '../routes/routes.js'
dotenv.config()
// await mongoose.connect(process.env.MONGOURL).then(()=>console.log("Connected to Mongo"))
// SESSION
const store= MongoStore.create({mongoUrl:process.env.MONGOURL, ttl:600000})
const sessionMiddleware =Session({
store,
secret: 'C0>1NG S0M3TH1NG',
cookie: { maxAge: 600000 },
resave: false,
saveUninitialized: false
})
//MIDDLEWARE FUNCTION 
export const middleWareLoader =async(express,app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extends:false}))
    app.use(sessionMiddleware)
    const passportObject=(await passportConfigBuilder({db:process.env.MONGOURL,dbSchema:UserSchema.obj},"MONGO"))
        .GoogleoAuth({
            clientID:"781852376959-1rqb531406erb9hplkvcrg7rmhdjp0hb.apps.googleusercontent.com",
            clientSecret:"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",
            callbackURL:"http://localhost:8080/auth/google/callback"},false)
        .buildLocalConfig()
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    app.use(morgan(morganWinston))
    app.use(express.static("./src/public"))
    app.use("/gql",graphqlHTTP({
        schema,
        rootValue:root
    }))
    app.use("/login",routes.login)
    app.use("/register",routes.register)
    app.use("/home",routes.home)
    app.use("/logout",routes.logout)
    app.use("/viewProfile",routes.profile)
    app.use("/addProduct",routes.addProduct)
    app.use("/viewProducts",routes.showproducts)
    app.use("/addcart",routes.addcart)
    app.use("/viewcart",routes.viewcart)
    app.use("/sale",routes.sales)
    app.get("/auth/google/callback",passport.authenticate("google",{failureRedirect:"/login/failure",successRedirect:"/viewProducts"}))
    
    //app.use("/",routes)
    handleConfig(app)   
return passportObject
}