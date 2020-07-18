import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Offer, Game } from 'src/app/types';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
   offer$: Observable<Offer>;
   game: Game;
   loading = true;
   code = Math.floor(Math.random() * 8999) + 1000;
   ownTicket = false;

   constructor(
      private route: ActivatedRoute,
      private router: Router,
      private db: AngularFirestore,
      private auth: AuthService
   ) { }

   ngOnInit() {
      const gameID = this.route.snapshot.queryParamMap.get('g');
      const offerID = this.route.snapshot.queryParamMap.get('o');

      const gameRef = this.db.collection('games').doc(gameID);
      this.offer$ = gameRef.collection('offers').doc(offerID).valueChanges() as Observable<Offer>;
      gameRef.get().toPromise().then(gameSS =>
         this.game = {...gameSS.data(), gameID, gameday: gameSS.data().gameday.toDate().toLocaleDateString()} as Game);

      this.offer$.subscribe(offer => {
         if (offer) {
            this.auth.user$.subscribe(user => {
               this.ownTicket = user.email === offer.email;
               this.loading = false;
            });
         }
      });
   }

   viewMyTicket() {
      this.router.navigate(['listing'], {queryParams: {g: this.game.gameID}});
   }

   cancel() {
      this.router.navigate(['market']);
   }

}
