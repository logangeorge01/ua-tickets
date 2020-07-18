import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game, Offer, User } from '../../types';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
   game: Game;
   offers$: Observable<Offer[]>;
   lowerRN = true;
   hasListedTicket: boolean;
   phone: string;

   constructor(
      private auth: AuthService,
      private db: AngularFirestore,
      private router: Router
   ) { }

   ngOnInit() {
      this.db.collection('games', ref => ref.where('current', '==', true)).get().toPromise()
      .then(game => {
         const gameID = game.docs[0].id;
         this.game = {
            ...game.docs[0].data(),
            gameID,
            gameday: game.docs[0].data().gameday.toDate().toLocaleDateString()
         } as Game;
         this.offers$ = this.db.collection('games').doc(gameID).collection('offers', ref => ref.orderBy('price')).snapshotChanges().pipe(
            map(offersSS => offersSS.map(offerSS => ({...offerSS.payload.doc.data(), offerID: offerSS.payload.doc.id} as Offer)))
         );

         this.auth.user$.subscribe(user =>
            this.hasListedTicket = user.offers && user.offers.findIndex(offer => offer.gameID === gameID) > -1);
      });
   }

   toggleBowl(target: HTMLElement) {
      target.style.color = '#000';
      ((target.previousSibling || target.nextSibling) as HTMLElement).style.color = '#888';
      this.lowerRN = !this.lowerRN;
   }

   buyTicket(offerID: string) {
      this.router.navigate(['buy'], {queryParams: {g: this.game.gameID, o: offerID}});
   }

   sellTicket() {
      this.router.navigate(['sell'], {queryParams: {g: this.game.gameID}});
   }

   updatePhone(uid: string) {
      this.db.collection('users').doc(uid).update({phone: this.phone});
   }

   viewMyTicket() {
      this.router.navigate(['listing'], {queryParams: {g: this.game.gameID}});
   }

   logout() {
      this.auth.signOut();
   }

}
