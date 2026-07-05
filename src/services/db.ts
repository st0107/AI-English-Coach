import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  level: string;
  xp: number;
  streak: number;
  lastActive: string;
  fluencyScore: number;
  wordsLearned: number;
  speakingTimeMinutes: number;
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const createUserProfile = async (uid: string, initialLevel: string = 'B1') => {
  const profile: UserProfile = {
    uid,
    level: initialLevel,
    xp: 0,
    streak: 0,
    lastActive: new Date().toISOString(),
    fluencyScore: 50,
    wordsLearned: 0,
    speakingTimeMinutes: 0
  };
  await setDoc(doc(db, 'users', uid), profile);
  return profile;
};

export const updateUserStats = async (uid: string, stats: Partial<UserProfile>) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, stats);
};

export const addXP = async (uid: string, amount: number) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, { xp: increment(amount) });
};

// Vocabulary
export interface VocabWord {
  id?: string;
  uid: string;
  word: string;
  meaning: string;
  mastery: number; // 0-100
  lastReviewed: string;
}

export const saveVocabWord = async (uid: string, word: string, meaning: string) => {
  const vocabRef = collection(db, 'vocabulary');
  const q = query(vocabRef, where('uid', '==', uid), where('word', '==', word));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    await addDoc(vocabRef, {
      uid,
      word,
      meaning,
      mastery: 0,
      lastReviewed: new Date().toISOString()
    });
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { wordsLearned: increment(1) });
  }
};
