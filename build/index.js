"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var http_1 = __importDefault(require("http"));
var https_1 = __importDefault(require("https"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var admin = __importStar(require("firebase-admin"));
dotenv_1.default.config();
// src : https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
// apns : https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification
/************************** CONFIG & CONSTANTS **************************/
//#region CONFIG & CONSTANTS
var HTTPS_PORT = process.env.HTTPS_PORT || 443;
var HTTP_PORT = process.env.HTTP_PORT || 80;
var SERVER_KEY = fs_1.default.readFileSync(path_1.default.join(__dirname, '../key.pem'));
var SERVER_CERT = fs_1.default.readFileSync(path_1.default.join(__dirname, '../cert.pem'));
var FIREBASE_CERT = require('../serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(FIREBASE_CERT) });
var messaging = admin.messaging();
var app = express_1.default();
//#endregion
/************************** MIDDLEWARE **************************/
//#region MIDDLEWARE
app.use(cors_1.default());
app.use(body_parser_1.default.json());
//#endregion
/************************** REST API **************************/
//#region REST API
app.get('/', function (_, res) { return res.status(200).send('Server is running...'); });
app.post('/', function (req, res) {
    if (!req.body.token)
        return res.status(422).send({ error: 'Bad Input (missing token)' });
    var message = {
        token: req.body.token,
        data: req.body.data || { name: 'pangpond', show_in_foreground: true },
        notification: {
            title: req.body.title || 'à¹à¸ˆà¹‰à¸‡à¸‚à¹ˆà¸²à¸§à¸ªà¸²à¸£à¸ˆà¸²à¸ Nextschool',
            body: req.body.msg,
        },
        android: {
            priority: 'high',
            notification: {
                notificationCount: req.body.badge || 0,
                sound: 'default',
            },
        },
        apns: {
            payload: {
                aps: {
                    badge: req.body.badge || 0,
                    sound: 'default',
                    contentAvailable: true,
                },
            },
        },
        condition: req.body.condition || null,
    };
    messaging
        .send(message)
        .then(function (response) { return res.status(200).send({ status: 'Success', response: response }); })
        .catch(function (error) { return res.status(400).send(error); });
});
//#endregion
/************************** TEST API **************************/
//#region TEST API
// const registrationToken = process.env.TEST_DEVICE_TOKEN_ANDROID;
var registrationToken = process.env.TEST_DEVICE_TOKEN_IOS;
var message = {
    token: registrationToken,
    data: {
        Nick: 'Mario',
        Room: 'PortugalVSDenmark',
    },
    notification: {
        title: 'Test Text Title',
        body: 'Test Text Body',
    },
    android: {
        priority: 'high',
        notification: {
            notificationCount: 0,
            sound: 'default',
        },
    },
    apns: {
        payload: {
            aps: {
                badge: 0,
                sound: 'default',
                contentAvailable: true,
            },
        },
    },
    condition: null,
};
app.get('/test', function (_, res) {
    messaging
        .send(message)
        .then(function (response) { return res.status(200).send({ status: 'Success', response: response }); })
        .catch(function (error) { return res.status(400).send(error); });
});
//#endregion
/************************** SERVER LISTENING **************************/
//#region SERVER LISTENING
var httpServer = http_1.default.createServer(app);
var httpsServer = https_1.default.createServer({ key: SERVER_KEY, cert: SERVER_CERT }, app);
httpServer.listen(HTTP_PORT, function () { return console.log("HTTP Server is listening on port: " + HTTP_PORT); });
httpsServer.listen(HTTPS_PORT, function () { return console.log("HTTPS Server is listening on port: " + HTTPS_PORT); });
//#endregion
