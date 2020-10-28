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
const FIREBASE_CERT = require('../serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(FIREBASE_CERT) });

const messaging = admin.messaging();
const app = express();

/************************** MIDDLEWARE **************************/
app.use(cors());
app.use(promBundle({ metricType: 'histogram', includePath: true, includeUp: false }));
app.use(bodyParser.json());

/************************** REST API **************************/
app.get('/', (_: Request, res: Response) => res.status(200).send('Server is running...'));

app.post('/', (req: Request, res: Response) => {
  let data = "{ name: 'pangpond', show_in_foreground: 'true' }";

  if (!req.body.token) return res.status(422).send({ error: 'Bad Input (missing token)' });
  if (req.body.data) data = JSON.stringify(req.body.data);

  const message: Message = {
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
    .then((response) => res.status(200).send({ status: 'Success', message }))
    .catch((error) => res.status(400).send(error));
});

app.post('/test', (req, res) => {
  res.send(JSON.stringify(req.body));
});

/************************** SERVER LISTENING **************************/
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
