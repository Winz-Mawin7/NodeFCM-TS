import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import promBundle from 'express-prom-bundle';

dotenv.config();

/************************** TYPE **************************/
type Message = admin.messaging.Message;
// src : https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
// apns : https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification

/************************** CONFIG & CONSTANTS **************************/
const PORT = process.env.PORT || 443;
const FIREBASE_CERT = require('../serviceAccountKey.notif.json');

admin.initializeApp({ credential: admin.credential.cert(FIREBASE_CERT) });

const messaging = admin.messaging();
const metricsMiddleware = promBundle({ metricType: 'histogram', includePath: true, includeUp: false });

const app = express();

/************************** MIDDLEWARE **************************/
app.use(cors());
app.use(metricsMiddleware);
app.use(bodyParser.json());

/************************** REST API **************************/
app.get('/', (_: Request, res: Response) => res.status(200).send('Server is running...'));

app.post('/', (req: Request, res: Response) => {
  let data = "{ name: 'pangpond', show_in_foreground: true }"; // default data

  if (!req.body.token) return res.status(422).send({ error: 'Bad Input (missing token)' });
  if (req.body.data) data = JSON.stringify(req.body.data);

  const message: any = {
    token: req.body.token,
    data: { data },
    notification: {
      title: req.body.title || 'ข้อมูลข่าวสารจาก Nextschool',
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
    .then((response) => res.status(200).send({ status: 'Success', response, data: message }))
    .catch((error) => res.status(400).send(error));
});

/************************** TEST API **************************/
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

app.get('/fcm-test', (_: Request, res: Response) => {
  messaging
    .send(message)
    .then((response) => res.status(200).send({ status: 'Success', response }))
    .catch((error) => res.status(400).send(error));
});

app.post('/performance', (req, res) => {
  res.send(req.body);
});

/************************** SERVER LISTENING **************************/
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
