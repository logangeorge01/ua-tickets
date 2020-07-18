import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth, firestore } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../types';

@Injectable({ providedIn: 'root' })
export class AuthService {
   user$: Observable<User>;

   constructor(
      private afAuth: AngularFireAuth,
      private db: AngularFirestore,
      private router: Router
   ) {
      this.user$ = this.afAuth.authState.pipe(
         switchMap(user => {
         return user ? this.db.collection('users').doc(user.uid).valueChanges() : of(null);
         })
      ) as any;
   }

   async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
   }

   private async updateUserData(user) {
      const userRef: AngularFirestoreDocument = this.db.collection('users').doc(user.uid);

      const code = await this.db.collection('ucount').doc('ucount').get().toPromise().then(docSS => {
         docSS.ref.update({ucount: firestore.FieldValue.increment(1)});
         return ('00' + docSS.data().ucount).slice(-3);
      });

      const data = {
         uid: user.uid,
         email: user.email,
         displayName: user.displayName,
         photoURL: user.photoURL,
         code
      };

      return userRef.set(data, { merge: true });
   }

   async signOut() {
      await this.afAuth.auth.signOut();
      this.router.navigate(['']);
   }
}
