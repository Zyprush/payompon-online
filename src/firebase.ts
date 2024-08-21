'use client'

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCfQAl0KJIpshe448yvcvgQGATWUPpkxEA",
  authDomain: "brgy-online.firebaseapp.com",
  projectId: "brgy-online",
  storageBucket: "brgy-online.appspot.com",
  messagingSenderId: "119198428002",
  appId: "1:119198428002:web:f9d050bd81e1400e375a3b"
};

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)