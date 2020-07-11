import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
   user$: Observable<{
      uid: string;
      email: string;
      photoURL?: string;
      displayName?: string;
      offers?: {
         game: string;
         price: number;
      }[];
   }>;

   constructor(
      private afAuth: AngularFireAuth,
      private afs: AngularFirestore,
      private router: Router
   ) {
      this.user$ = this.afAuth.authState.pipe(
         switchMap(user => {
         return user ? this.afs.collection('users').doc(user.uid).valueChanges() : of(null);
         })
      ) as any;
   }

   async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      return this.updateUserData(credential.user);
   }

   private updateUserData(user) {
      const userRef: AngularFirestoreDocument = this.afs.doc(`users/${user.uid}`);

      const data = {
         uid: user.uid,
         email: user.email,
         displayName: user.displayName,
         photoURL: user.photoURL
      };

      return userRef.set(data, { merge: true });
   }

   async signOut() {
      await this.afAuth.auth.signOut();
      this.router.navigate(['']);
   }
}
