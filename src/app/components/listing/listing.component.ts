import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game } from 'src/app/types';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
   game: Game;

   constructor(
      private auth: AuthService,
      private route: ActivatedRoute,
      private db: AngularFirestore
   ) { }

   ngOnInit() {
      const gameID = this.route.snapshot.queryParamMap.get('g');
      const gameRef = this.db.collection('games').doc(gameID);

      gameRef.get().toPromise().then(gameSS =>
         this.game = {...gameSS.data(), gameID, gameday: gameSS.data().gameday.toDate().toLocaleDateString()} as Game);
   }

}
