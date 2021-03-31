import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StockCreateComponent} from './stock-create/stock-create.component';
import {StockComponent} from './stock.component';



const routes: Routes = [{ path: '', component: StockComponent },
  {path: 'app-stock-create', component: StockCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
