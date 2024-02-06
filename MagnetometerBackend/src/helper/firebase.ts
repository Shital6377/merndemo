import admin from "firebase-admin";
// import { initializeApp } from 'firebase-admin/app';
import log4js from "log4js";
const logger = log4js.getLogger();
var serviceAccount = require('../quakemeup-b5167-firebase-adminsdk-36tlj-cafc8474f6.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const sendPushNotification = async (token: any, obj: any) => {
    
    if (token.length) {
        let dataSend: any = {
            "title": obj.title,
            "message": obj.notification_body
        }

        await admin.messaging().sendMulticast({
            data: dataSend,
            notification: {
                title: obj.title,
                body: obj.notification_body
            },
            tokens: token
        }).then((value) => {
            console.log('Successfully sent message:', value);
            console.log(value.responses);
            logger.info("Admin :: Successfully sent message Issue");
            logger.info(value.responses);
        }).catch((error) => {
            console.log('Error sending message:', error);
            throw error
        });
    } else {
        console.log('null pass token on');
        logger.info("null pass token on");
    }
}
export default {
    sendPushNotification,
}
