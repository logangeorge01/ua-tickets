import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MarketComponent } from './components/market/market.component';
import { HomeGuard, AuthGuard } from './guards/guards';
import { SellComponent } from './components/sell/sell.component';
import { BuyComponent } from './components/buy/buy.component';
import { ListingComponent } from './components/listing/listing.component';


const routes: Routes = [
   { path: '', component: HomeComponent, canActivate: [HomeGuard] },
   { path: 'market', component: MarketComponent, canActivate: [AuthGuard] },
   { path: 'sell', component: SellComponent, canActivate: [AuthGuard] },
   { path: 'buy', component: BuyComponent, canActivate: [AuthGuard] },
   { path: 'listing', component: ListingComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
