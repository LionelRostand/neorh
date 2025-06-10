
import { doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export class SessionManager {
  private static instance: SessionManager;
  private sessionId: string;
  private userId: string | null = null;
  private unsubscribe: (() => void) | null = null;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async createSession(userId: string): Promise<boolean> {
    try {
      this.userId = userId;
      const sessionRef = doc(db, 'user_sessions', userId);
      
      // Créer ou mettre à jour la session
      await setDoc(sessionRef, {
        sessionId: this.sessionId,
        userId: userId,
        lastActivity: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      // Écouter les changements de session
      this.unsubscribe = onSnapshot(sessionRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.sessionId !== this.sessionId) {
            // Une autre session a pris le contrôle
            this.handleSessionConflict();
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la création de session:', error);
      return false;
    }
  }

  private handleSessionConflict() {
    console.log('Session conflict detected - logging out');
    // Forcer la déconnexion
    window.location.reload();
  }

  async updateActivity() {
    if (!this.userId) return;
    
    try {
      const sessionRef = doc(db, 'user_sessions', this.userId);
      await setDoc(sessionRef, {
        sessionId: this.sessionId,
        userId: this.userId,
        lastActivity: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'activité:', error);
    }
  }

  async destroySession() {
    if (!this.userId) return;

    try {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }

      const sessionRef = doc(db, 'user_sessions', this.userId);
      await deleteDoc(sessionRef);
      this.userId = null;
    } catch (error) {
      console.error('Erreur lors de la destruction de session:', error);
    }
  }
}

export const sessionManager = SessionManager.getInstance();
