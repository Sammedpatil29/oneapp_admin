import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './home/home.component';
import { ServiceControlComponent } from './components/service-control/service-control.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MetadataComponent } from './components/metadata/metadata.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { EventsComponent } from './components/events/events.component';
import { PropertyComponent } from './components/property/property.component';
import { authGuard } from './auth.guard';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { GroceryComponent } from './components/grocery/grocery.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'service-control',
        component: ServiceControlComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'complaints',
        component: ComplaintsComponent,
      },
      {
        path: 'suggestions',
        component: SuggestionsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'metadata',
        component: MetadataComponent,
      },
      {
        path: 'manageUsers',
        component: ManageUsersComponent,
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        children: [
          {
            path: 'events',
            component: EventsComponent,
          },
          {
            path: 'property',
            component: PropertyComponent,
          },
          {
            path: 'grocery',
            component: GroceryComponent,
          },
        ],
      },
    ],
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];
