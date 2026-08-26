import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  Firestore,
  updateDoc
} from "firebase/firestore";
import { VajraStudent, TrainingVideo, VajraMessage } from "./store";

// Firebase Configuration via Environment Variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

// Check if Firebase keys are properly provided
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
};

if (typeof window !== "undefined") {
  if (isFirebaseConfigured()) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      db = getFirestore(app);
      console.log("⚡ Firebase Firestore connected successfully for real-time sync!");
    } catch (error) {
      console.warn("Firebase initialization skipped or failed:", error);
    }
  } else {
    console.log("ℹ️ Running in Local Storage Mode (Add Firebase keys to .env.local / Vercel for Cloud Sync)");
  }
}

/* =========================================================================
    CLOUD FIRESTORE REAL-TIME SYNC HELPERS
   ========================================================================= */

// 1. STUDENTS REALTIME SYNC
export const syncStudentToCloud = async (student: VajraStudent) => {
  if (!db) return;
  try {
    const studentRef = doc(db, "vajra_students", student.accessCode.toUpperCase());
    await setDoc(studentRef, student, { merge: true });
  } catch (err) {
    console.error("Failed to sync student to cloud:", err);
  }
};

export const deleteStudentFromCloud = async (accessCode: string) => {
  if (!db) return;
  try {
    const studentRef = doc(db, "vajra_students", accessCode.toUpperCase());
    await deleteDoc(studentRef);
  } catch (err) {
    console.error("Failed to delete student from cloud:", err);
  }
};

export const listenToStudentsCloud = (callback: (students: VajraStudent[]) => void) => {
  if (!db) return () => {};
  try {
    const studentsCol = collection(db, "vajra_students");
    return onSnapshot(studentsCol, (snapshot) => {
      const list: VajraStudent[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as VajraStudent);
      });
      callback(list);
    }, (error) => {
      console.warn("Error listening to students cloud:", error);
    });
  } catch (e) {
    console.warn(e);
    return () => {};
  }
};

// 2. GOOGLE MEET REALTIME SYNC
export const syncMeetLinkToCloud = async (course: string, link: string, timestamp: number) => {
  if (!db) return;
  try {
    const meetRef = doc(db, "vajra_meet_links", course.toUpperCase());
    await setDoc(meetRef, {
      course: course.toUpperCase(),
      url: link,
      updatedAt: timestamp
    }, { merge: true });
  } catch (err) {
    console.error("Failed to sync meet link to cloud:", err);
  }
};

export const listenToMeetLinksCloud = (callback: (links: Record<string, { url: string; updatedAt: number }>) => void) => {
  if (!db) return () => {};
  try {
    const meetCol = collection(db, "vajra_meet_links");
    return onSnapshot(meetCol, (snapshot) => {
      const records: Record<string, { url: string; updatedAt: number }> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.course && data.url) {
          records[data.course] = {
            url: data.url,
            updatedAt: data.updatedAt || Date.now()
          };
        }
      });
      callback(records);
    }, (error) => {
      console.warn("Error listening to meet links cloud:", error);
    });
  } catch (e) {
    console.warn(e);
    return () => {};
  }
};

// 3. PRACTICE VIDEOS REALTIME SYNC
export const syncVideoToCloud = async (video: TrainingVideo) => {
  if (!db) return;
  try {
    const videoRef = doc(db, "vajra_videos", video.id);
    await setDoc(videoRef, video, { merge: true });
  } catch (err) {
    console.error("Failed to sync video to cloud:", err);
  }
};

export const deleteVideoFromCloud = async (videoId: string) => {
  if (!db) return;
  try {
    const videoRef = doc(db, "vajra_videos", videoId);
    await deleteDoc(videoRef);
  } catch (err) {
    console.error("Failed to delete video from cloud:", err);
  }
};

export const listenToVideosCloud = (callback: (videos: TrainingVideo[]) => void) => {
  if (!db) return () => {};
  try {
    const videosCol = collection(db, "vajra_videos");
    return onSnapshot(videosCol, (snapshot) => {
      const list: TrainingVideo[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as TrainingVideo);
      });
      callback(list);
    }, (error) => {
      console.warn("Error listening to videos cloud:", error);
    });
  } catch (e) {
    console.warn(e);
    return () => {};
  }
};

// 4. STUDENT & ADMIN IN-APP MESSAGES REALTIME SYNC
export const syncMessageToCloud = async (message: VajraMessage) => {
  if (!db) return;
  try {
    const msgRef = doc(db, "vajra_messages", message.id);
    await setDoc(msgRef, message, { merge: true });
  } catch (err) {
    console.error("Failed to sync message to cloud:", err);
  }
};

export const replyMessageInCloud = async (messageId: string, replyText: string) => {
  if (!db) return;
  try {
    const msgRef = doc(db, "vajra_messages", messageId);
    await updateDoc(msgRef, {
      reply: replyText,
      repliedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      status: 'REPLIED'
    });
  } catch (err) {
    console.error("Failed to reply message in cloud:", err);
  }
};

export const deleteMessageFromCloud = async (messageId: string) => {
  if (!db) return;
  try {
    const msgRef = doc(db, "vajra_messages", messageId);
    await deleteDoc(msgRef);
  } catch (err) {
    console.error("Failed to delete message from cloud:", err);
  }
};

export const listenToMessagesCloud = (callback: (messages: VajraMessage[]) => void) => {
  if (!db) return () => {};
  try {
    const msgsCol = collection(db, "vajra_messages");
    return onSnapshot(msgsCol, (snapshot) => {
      const list: VajraMessage[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as VajraMessage);
      });
      // Sort newest first
      list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(list);
    }, (error) => {
      console.warn("Error listening to messages cloud:", error);
    });
  } catch (e) {
    console.warn(e);
    return () => {};
  }
};
