import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubNavComponent } from './subnav.component'; 
import { LayoutComponent } from './layout.component'; 
import { OverviewComponent } from './overview.component';
import { DepartmentAddEditComponent } from './departments/add-edit.component';
import { ListComponent } from './departments/list.component';

const accountsModule = () => import('./accounts/accounts.module').then(x => x. AccountsModule);

const routes: Routes = [
    
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: OverviewComponent },
            { path: 'accounts', loadChildren: accountsModule },
            { path: 'departments', component: ListComponent },
            { path: 'departments/add', component: DepartmentAddEditComponent },
            { path: 'departments/edit/:id', component: DepartmentAddEditComponent }
        ]
    }
];    
@NgModule({
    imports: [RouterModule.forChild(routes)], 
    exports: [RouterModule]

})
export class AdminRoutingModule {}