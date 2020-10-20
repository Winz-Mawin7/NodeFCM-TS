import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import cors from 'cors';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

/************************** TYPE **************************/
type Message = admin.messaging.Message;
// src : https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
// apns : https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification

/************************** CONFIG & CONSTANTS **************************/
//#region CONFIG & CONSTANTS
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const HTTP_PORT = process.env.HTTP_PORT || 80;
const SERVER_KEY = fs.readFileSync(path.join(__dirname, '../key.pem'));
const SERVER_CERT = fs.readFileSync(path.join(__dirname, '../cert.pem'));
const FIREBASE_CERT = require('../serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(FIREBASE_CERT) });

const messaging = admin.messaging();
const app = express();
//#endregion

/************************** MIDDLEWARE **************************/
//#region MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//#endregion

/************************** REST API **************************/
//#region REST API
app.get('/', (_: Request, res: Response) => res.status(200).send('Server is running 2...'));

app.post('/', (req: Request, res: Response) => {
  if (!req.body.token) return res.status(422).send({ error: 'Bad Input (missing token)' });

  const message: Message = {
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
    .then((response) => res.status(200).send({ status: 'Success', response }))
    .catch((error) => res.status(400).send(error));
});
//#endregion

/************************** TEST API **************************/
//#region TEST API
const registrationToken = process.env.TEST_DEVICE_TOKEN_ANDROID;
// const registrationToken = process.env.TEST_DEVICE_TOKEN_IOS;

const message: Message = {
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

app.get('/test', (_: Request, res: Response) => {
  messaging
    .send(message)
    .then((response) => res.status(200).send({ status: 'Success', response }))
    .catch((error) => res.status(400).send(error));
});

app.post('/test2', (req, res) => {
  res.send(JSON.stringify(req.body));
});
//#endregion

/************************** SERVER LISTENING **************************/
//#region SERVER LISTENING
const httpServer = http.createServer(app);
const httpsServer = https.createServer({ key: SERVER_KEY, cert: SERVER_CERT }, app);

httpServer.listen(HTTP_PORT, () => console.log(`HTTP Server is listening on port: ${HTTP_PORT}`));
httpsServer.listen(HTTPS_PORT, () => console.log(`HTTPS Server is listening on port: ${HTTPS_PORT}`));
//#endregion
