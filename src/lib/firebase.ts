import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  addDoc,
  query,
  where,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ScoreDoc } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Critical: Must specify firestoreDatabaseId when initializing getFirestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Firestore Error Handler conforming to system specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial connection test
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection test indicates client is offline.');
    }
  }
}

// Test connection on boot
testConnection().catch(() => {});

/**
 * Sign in anonymously (No personal info, no Google account)
 * Gracefully handles cases where Anonymous provider is not yet enabled in the Firebase Console.
 */
export async function signInAnonymousStudent(): Promise<User | null> {
  try {
    if (auth.currentUser) {
      return auth.currentUser;
    }
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err: unknown) {
    const errorCode = (err as { code?: string })?.code || '';
    if (errorCode === 'auth/admin-restricted-operation') {
      console.warn(
        'ℹ️ Firebase 익명 로그인이 아직 활성화되지 않았습니다. Firebase 콘솔(Authentication -> Sign-in method)에서 "익명(Anonymous)" 제공업체를 사용 설정하면 클라우드 동기화가 활성화됩니다.'
      );
    } else {
      console.warn('Anonymous sign-in notice:', err);
    }
    return null;
  }
}

/**
 * Save student nickname to Firestore (strictly UID + Nickname, ZERO PII)
 */
export async function savePlayerProfile(userId: string, nickname: string): Promise<void> {
  const path = `players/${userId}`;
  try {
    const playerRef = doc(db, 'players', userId);
    const existingSnap = await getDoc(playerRef);

    if (existingSnap.exists()) {
      await setDoc(
        playerRef,
        {
          nickname,
        },
        { merge: true }
      );
    } else {
      await setDoc(playerRef, {
        id: userId,
        nickname,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Auto-save game score to Firestore 'scores' collection.
 * Completely non-blocking and safe so it never interrupts the game.
 */
export async function saveGameScore(nickname: string, score: number, classCode: string): Promise<void> {
  // Always update local cache immediately for offline & instant response
  try {
    const localKey = `infection5_scores_${classCode}`;
    const raw = localStorage.getItem(localKey);
    const list: ScoreDoc[] = raw ? JSON.parse(raw) : [];
    list.push({ nickname, score, classCode, createdAt: new Date().toISOString() });
    localStorage.setItem(localKey, JSON.stringify(list.slice(-50)));
  } catch {
    // ignore
  }

  // Cloud Firestore save: ensure anonymous login is completed first
  try {
    let currentUser = auth.currentUser;
    if (!currentUser) {
      currentUser = await signInAnonymousStudent();
    }

    if (currentUser) {
      const scoresCol = collection(db, 'scores');
      await addDoc(scoresCol, {
        nickname,
        score,
        classCode,
        createdAt: serverTimestamp(),
      });
    } else {
      console.warn('Anonymous login was not completed, score kept in local storage.');
    }
  } catch (err) {
    console.warn('Could not save score to cloud Firestore (saved locally):', err);
  }
}

/**
 * Real-time subscription to class leaderboard scores
 */
export function subscribeClassScores(classCode: string, onUpdate: (scores: ScoreDoc[]) => void): () => void {
  // Provide initial local cached scores right away
  try {
    const localKey = `infection5_scores_${classCode}`;
    const raw = localStorage.getItem(localKey);
    if (raw) {
      onUpdate(JSON.parse(raw));
    }
  } catch {
    // ignore
  }

  try {
    const q = query(collection(db, 'scores'), where('classCode', '==', classCode), limit(300));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const scores: ScoreDoc[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && typeof data.score === 'number' && typeof data.nickname === 'string') {
            scores.push({
              id: docSnap.id,
              nickname: data.nickname,
              score: data.score,
              classCode: data.classCode || classCode,
              createdAt: data.createdAt,
            });
          }
        });
        onUpdate(scores);
      },
      (error) => {
        console.warn('Leaderboard snapshot listener warning:', error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Could not attach snapshot listener:', err);
    return () => {};
  }
}
