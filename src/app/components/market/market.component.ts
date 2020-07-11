import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';

class Offer {
   name: string;
   price: number;
}

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
   offers$: Observable<Offer[]>;

   constructor(
      private auth: AuthService,
      private db: AngularFirestore
   ) { }

   ngOnInit() {
      this.offers$ = this.db.collection('currentGame').doc('cur').get().pipe(
         switchMap(gameSS => {
            const game = gameSS.data().game;
            const offerRef = this.db.collection('games').doc(game).collection('offers');
            return offerRef.snapshotChanges();
         }),
         map(offersSS => offersSS.map(offerSS => offerSS.payload.doc.data() as Offer))
      );
   }

   toggleBowl(c: string, n: string) {
      (document.querySelector(c) as HTMLElement).style.color = '#000';
      (document.querySelector(n) as HTMLElement).style.color = '#888';
   }

   logout() {
      this.auth.signOut();
   }

}
