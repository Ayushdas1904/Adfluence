import {
    initializeApp,
    getApps,
    getApp,
    App,
    cert,
} from "firebase-admin/app";


import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase/auth";

import serviceKey from '@/service_key.json' assert { type: 'json' };

let app: App;

if (getApps().length === 0) {
    app = initializeApp({
      credential: cert({
        projectId: serviceKey.project_id,
        clientEmail: serviceKey.client_email,
        privateKey: serviceKey.private_key,
      }),
    });
  } else {
    app = getApp();
  }
const adminDb = getFirestore(app);

export { app as adminApp, adminDb };