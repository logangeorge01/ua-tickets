import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService} from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HomeGuard implements CanActivate {
   constructor(
      private auth: AuthService,
      private router: Router
   ) {}

   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.auth.user$.pipe(
         map(usr => {
            if (usr && usr.email.indexOf('crimson.ua.edu') > 0) {
               this.router.navigate(['market']);
               return false;
            }
            return true;
         })
      );
   }
}

@Injectable()
export class MarketGuard implements CanActivate {
   constructor(
      private auth: AuthService,
      private router: Router
   ) {}

   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.auth.user$.pipe(
         map(usr => {
            if (!usr || usr.email.indexOf('crimson.ua.edu') === -1) {
               if (usr) {
                  alert('The account you signed in with was not a Crimson email.');
               }
               this.router.navigate(['']);
               return false;
            }
            return true;
         })
      );
   }
}