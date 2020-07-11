import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MarketComponent } from './components/market/market.component';
import { HomeGuard, MarketGuard } from './guards/guards';


const routes: Routes = [
   { path: '', component: HomeComponent, canActivate: [HomeGuard] },
   { path: 'market', component: MarketComponent, canActivate: [MarketGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
