import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { FieldValue } from '@google-cloud/firestore';
import * as path from 'path';
import { getApps } from 'firebase-admin/app';

@Injectable()
export class FirebaseService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly CREDENTIALS_PATH = path.join(
    process.cwd(),
    'firebase-credentials.json',
  );
  constructor() {
    if (!getApps().length) {
      firebase.initializeApp({
        credential: firebase.credential.cert(this.CREDENTIALS_PATH),
      });
    }

    this.db = firebase.firestore();
  }

  getFirestoreInstance(): FirebaseFirestore.Firestore {
    return this.db;
  }

  async getAllData(collectionPath: string): Promise<any[]> {
    const snapshot = await this.db.collection(collectionPath).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async add(collectionPath: string, data: any): Promise<any> {
    const docRef = await this.db.collection(collectionPath).add(data);
    const snapshot = await docRef.get();
    return { id: snapshot.id, ...snapshot.data() };
  }

  async update(collectionPath: string, id: string, data: any): Promise<void> {
    await this.db.collection(collectionPath).doc(id).update(data);
    return;
  }

  async delete(collectionPath: string, id: string): Promise<void> {
    await this.db.collection(collectionPath).doc(id).delete();
    return;
  }

  public timestamp(): FieldValue {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}
