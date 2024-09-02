import admin from "firebase-admin";

// Initialize the Admin SDK once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: "brgy-online.appspot.com", // Replace with your actual storage bucket
  });
}

export default admin;
export const dbAdmin = admin.firestore();
export const storageAdmin = admin.storage();
