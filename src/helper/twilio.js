import dotenv from 'dotenv'
import  Twilio  from 'twilio';
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client =Twilio(accountSid, authToken);


      export default client