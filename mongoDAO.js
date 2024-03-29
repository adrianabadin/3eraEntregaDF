"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDAO = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const loggerHLP_1 = require("../helper/loggerHLP");
class MongoDAO {
    constructor(db, schemaType, basicSchema = new mongoose_1.Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isVerified: { type: Boolean, default: true }
    }), gooogleOauthSchema = new mongoose_1.Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        lastName: String,
        avatar: String
    }), isLocal = (schemaType === 'localSchema'), isSchema = (data) => {
        if (data instanceof mongoose_1.Schema)
            return true;
        else
            return false;
    }, isDbConnected = () => {
        return mongoose_1.default.connection.readyState === 2;
    }, isDbConnectionSchema = (db) => {
        if (!isSchema(db)) {
            if ("db" in db && "dbSchema" in db) {
                if (typeof db["db"] === "string") {
                    let response;
                    try {
                        const schema = new mongoose_1.Schema(db.dbSchema);
                        response = true;
                    }
                    catch (e) {
                        response = false;
                    }
                    return response;
                }
            }
        }
        return false;
    }, ClassBuilder = () => {
        let dataSchema;
        let dbConnectionObject;
        if (isSchema(db)) {
            dataSchema = db;
            this.model = isLocal ? mongoose_1.default.model('localCollection', dataSchema.add(basicSchema)) : mongoose_1.default.model('goaCollection', gooogleOauthSchema);
        }
        else if (isDbConnectionSchema(db)) {
            dbConnectionObject = db;
            let schema = new mongoose_1.Schema(dbConnectionObject.dbSchema);
            schema.add(basicSchema);
            this.model = isLocal ? mongoose_1.default.model('localCollection', schema) : mongoose_1.default.model("goaCollection", gooogleOauthSchema);
        }
        this.findById = (id, cb) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(id);
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "findById", response });
                cb(null, response);
            }
            catch (e) {
                const error = e;
                loggerHLP_1.loggerObject.error.error({ level: "error", title: error.name === "CastError"
                        ? "Wrong ID Structure"
                        : error.name === "DocumentNotFoundError"
                            ? "Document not Founded"
                            : error.name, message: error.message, error: error.reason });
            }
        });
        this.findByUserName = (username) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findOne({ username });
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "findByUserName", response });
                return response;
            }
            catch (e) {
                const error = e;
                loggerHLP_1.loggerObject.error.error({ level: "error", title: error.name === "CastError"
                        ? "Wrong ID Structure"
                        : error.name === "DocumentNotFoundError"
                            ? "Document not Founded"
                            : error.name, message: error.message, error: error.reason });
            }
        });
        this.createUser = (user) => __awaiter(this, void 0, void 0, function* () {
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "createUser" });
            try {
                const response = yield this.model.create(user);
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "createUser", response });
                return response;
            }
            catch (e) {
                const error = e;
                loggerHLP_1.loggerObject.error.error({ level: "error",
                    title: error.name === "ValidationError"
                        ? "Object parsed dont Validate mongoose schema"
                        : error.name === "CastError"
                            ? "Error converting types"
                            : error.name === "MongoError"
                                ? "Mongo Error"
                                : error.name,
                    message: error.message, error: error.errmsg ? error.errmsg : error });
            }
        });
        this.returnFields = () => {
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "returnFields" });
            if (this.model instanceof (mongoose_1.default.model)) {
                const response = Object.keys(this.model.schema.obj);
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "returnFields", response });
                return response;
            }
            else {
                loggerHLP_1.loggerObject.error.error({ level: "error", message: "This.model is not an instance of mongoose.models so it is imposible to retrive fields", error: "This.model is not defined" });
                return { message: "This.model is not an instance of mongoose.models so it is imposible to retrive fields", error: "This.model is not defined" };
            }
        };
        ////FIN DE CLASSBUILDER  
    }) {
        this.db = db;
        this.schemaType = schemaType;
        this.basicSchema = basicSchema;
        this.gooogleOauthSchema = gooogleOauthSchema;
        this.isLocal = isLocal;
        this.isSchema = isSchema;
        this.isDbConnected = isDbConnected;
        this.isDbConnectionSchema = isDbConnectionSchema;
        this.ClassBuilder = ClassBuilder;
        const data = db;
        if (isSchema(db)) {
            if (isDbConnected())
                ClassBuilder();
            else
                throw new Error("Db must be conected before if you are using a Schema as param");
        }
        else {
            if (isDbConnectionSchema(data.dbSchema)) {
                mongoose_1.default.set("strictQuery", false);
                mongoose_1.default.connect(data.db)
                    .then(() => {
                    loggerHLP_1.loggerObject.info.info({ level: "info", message: "Connected to MongoDB" });
                    ClassBuilder();
                })
                    .catch(error => {
                    loggerHLP_1.loggerObject.error.error({ level: "error", message: "Error Connecting to Mongo DB", error });
                });
            }
            else
                throw new Error("The params provided should be a mongoose schema or a configuration object containig the following structure {db:'Conection String',dbSchema:{a valid schema definition}}");
        }
    }
}
module.exports = MongoDAO;

//Funciones que deben ser iguales
//  public model:Model<any>  = isLocal ? mongoose.model('localCollection',db.add(basicSchema)) :mongoose.model('goaCollection',gooogleOauthSchema),
//public findById=async (id:string,cb:any):Promise<any> =>{
//   loggerObject.debug.debug({level:"debug",message:"findById"})
//   try{
//   this.model.findById(id,cb)
// }catch(e){loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`})}
// },
// public findByUserName=async (username:string):Promise<any> =>{
//   loggerObject.debug.debug({level:"debug",message:"findByUserName"})
//   try {
//     return await this.model.findOne({username})
// }catch(e)
// {
//   loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`})
// } 
// },
// public createUser=async (user:any):Promise<any>=>{
//   loggerObject.debug.debug({level:"debug",message:"createUser"})
//   try {
//     return await this.model.create(user)
//   }
//   catch(e){
//     loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`})
//   } 
// },
// public returnFields= ():string[]|ErrorMessage=> {
//   loggerObject.debug.debug({level:"debug",message:"returnFields"})
//   try {
//     return Object.keys(this.model.schema.obj)
//   } 
//   catch(e){loggerObject.error.error({level: "error",message:`${e}`})
//   return {message:"Something went wrong while retriving schema fields",error:`${e}`}
// }
// }
