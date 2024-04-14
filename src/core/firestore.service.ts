import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { FieldValue } from '@google-cloud/firestore';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private readonly db: FirebaseFirestore.Firestore;
  private readonly CREDENTIALS_PATH = path.join(
    process.cwd(),
    'firebase-credentials.json',
  );
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const serviceAccount = require('../../firebase-credentials.json');
    firebase.initializeApp({
      credential: firebase.credential.cert(this.CREDENTIALS_PATH),
    });
    this.db = firebase.firestore();
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('dotenv').config();
    }
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
