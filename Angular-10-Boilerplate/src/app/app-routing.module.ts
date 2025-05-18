import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

// List components
import { ListComponent as EmployeeList} from './admin/employees/list.component';
import { ListComponent as DepartmentList } from './admin/departments/list.component';
import { ListComponent as RequestList } from './admin/requests/list.component';
import { ListComponent as WorkflowList } from './admin/workflows/list.component';
import { ListComponent as AccountList } from './admin/accounts/list.component';
// Layout with subnav
import { LayoutComponent } from './admin/layout.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },
  { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },

  // ✅ Group all admin pages under LayoutComponent with <app-subnav>
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
    children: [
      { path: 'accounts', component: AccountList },
      { path: 'employees', component: EmployeeList },
      { path: 'departments', component: DepartmentList },
      { path: 'requests', component: RequestList },
      { path: 'workflows', component: WorkflowList }
    ]
  },

  // fallback route
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
