import { AngularFirestore } from '@angular/fire/firestore';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import 'firebase/firestore';
import { auth, firestore } from 'firebase/app';
import {switchMap} from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="auth.user | async as user; else showLogin">
      <h1>Hello {{ user.displayName }}!</h1>
      <button (click)="logout()">Logout</button>

      <input #inputRef/>
      <button (click)="add(inputRef.value)">add</button>

      <div *ngIf="user$ | async as user">
        <p *ngFor="let item of user.items">{{item}}</p>
      </div>
    </div>
    <ng-template #showLogin>
      <p>Please login.</p>
      <button (click)="login()">Login with Google</button>
    </ng-template>
  `,
})
export class AppComponent {
  user$;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user$ = this.afAuth.user.pipe(
      switchMap(user => {
        return user ? this.afs.doc(`users/${user.uid}`).valueChanges() : of(null);
      })
    );
  }

  login() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.signOut();
  }

  async add(val: string) {
    const uid = (await this.afAuth.currentUser).uid;
    await this.afs.doc(`users/${uid}`).update({
      items: firestore.FieldValue.arrayUnion(val)
    });
  }
}
