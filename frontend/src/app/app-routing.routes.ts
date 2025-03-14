import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'reservas-app',
        loadChildren: () => import('./pages/pages.module')
          .then(m => m.PagesModule),
    },
    {path: '**', redirectTo: 'reservas-app'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
