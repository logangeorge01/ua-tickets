import { Component, OnInit } from '@angular/core';
import { Game, User } from 'src/app/types';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { firestore } from 'firebase';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
   game: Game;
   lower: string;
   price: number;
   venmo: string;

   constructor(
      private db: AngularFirestore,
      private route: ActivatedRoute,
      private router: Router,
      private auth: AuthService
   ) { }

   ngOnInit() {
      const gameID = this.route.snapshot.queryParamMap.get('g');
      const gameRef = this.db.collection('games').doc(gameID);

      gameRef.get().toPromise().then(gameSS =>
         this.game = {...gameSS.data(), gameID, gameday: gameSS.data().gameday.toDate().toLocaleDateString()} as Game);
   }

   list(user: User) {
      Promise.resolve([
         this.db.collection('users').doc(user.uid).update({
            venmo: this.venmo,
            offers: firestore.FieldValue.arrayUnion({gameID: this.game.gameID, price: this.price})
         }),
         this.db.collection('games').doc(this.game.gameID).collection('offers').add({
            name: user.displayName,
            email: user.email,
            price: this.price,
            lower: this.lower === 'true'
         })
      ]).then(() => {
         alert('Your ticket has been listed successfully!');
         this.router.navigate(['market']);
      });
   }

   cancel() {
      this.router.navigate(['market']);
   }
}
