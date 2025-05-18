import { NgModule } from '@angular/core'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module'; 
import { SubNavComponent } from './subnav.component'; 
import { LayoutComponent } from './layout.component'; 
import { OverviewComponent } from './overview.component';
import { AddEditComponent } from './requests/add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        FormsModule
    ],
    declarations: [
        SubNavComponent,
        LayoutComponent,
        OverviewComponent,
        AddEditComponent
    ]
})

export class AdminModule {}