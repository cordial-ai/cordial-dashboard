import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore'

const firebaseConfig = {
  // Your Firebase configuration here
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export interface Persona {
  id: string
  name: string
  medications: string
  description: string
  isDefault: boolean
}

export const addPersona = async (persona: Omit<Persona, 'id'>) => {
  const docRef = await addDoc(collection(db, 'personas'), persona)
  return docRef.id
}

export const getPersonas = async (): Promise<Persona[]> => {
  const querySnapshot = await getDocs(collection(db, 'personas'))
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Persona))
}

export const updatePersona = async (persona: Persona) => {
  const personaRef = doc(db, 'personas', persona.id)
  await updateDoc(personaRef, persona)
}

