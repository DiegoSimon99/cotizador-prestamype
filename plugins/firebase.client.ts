import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'
import { useRatesStore } from '~/stores/useRates'

export default defineNuxtPlugin(() => {
  const c = useRuntimeConfig().public
  const app: FirebaseApp = initializeApp({
    apiKey: c.NUXT_PUBLIC_FIREBASE_API_KEY || c.firebaseApiKey,
    authDomain: c.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || c.firebaseAuthDomain,
    projectId: c.NUXT_PUBLIC_FIREBASE_PROJECT_ID || c.firebaseProjectId,
    storageBucket: c.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || c.firebaseStorageBucket,
    messagingSenderId: c.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || c.firebaseMessagingSenderId,
    appId: c.NUXT_PUBLIC_FIREBASE_APP_ID || c.firebaseAppId,
  })
  const db = getFirestore(app)

  if (process.client) {
    const store = useRatesStore()
    const collection = c.firebaseRatesCollection || c.NUXT_PUBLIC_FIREBASE_RATES_COLLECTION || 'rates'
    const docId = c.firebaseRatesDocId || c.NUXT_PUBLIC_FIREBASE_RATES_DOC_ID || 'TDmXIypgLKKfNggHHSnw'
    const ref = doc(db, collection, docId)

    onSnapshot(ref, (snap) => {
      const data = snap.data() as { purchase_price: number; sale_price: number } | undefined
      console.log(data)
      if (data) store.setRates(data.purchase_price, data.sale_price)
    })
  }
})
