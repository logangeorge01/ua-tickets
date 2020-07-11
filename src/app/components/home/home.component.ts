import { Component, OnInit } from '@angular/core';
import { RouterEvent, RouterLink, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
   constructor(
      private router: Router,
      public auth: AuthService
   ) { }

   ngOnInit() {
   }

   submit() {
      this.auth.googleSignin().then(() => this.router.navigate(['market']));
   }
}
