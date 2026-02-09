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
import { EmptyDataComponent } from './components/empty-data/empty-data.component';
import { DoctorAppointmentComponent } from './components/doctor-appointment/doctor-appointment.component';
import { SelectServiceComponent } from './components/select-service/select-service.component';
import { CreateNotificationsComponent } from './components/create-notifications/create-notifications.component';
import { VisitsComponent } from './components/visits/visits.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { TaskTrackerComponent } from './components/task-tracker/task-tracker.component';
import { BrahmadevConstructionsComponent } from './components/brahmadev-constructions/brahmadev-constructions.component';
import { BLayoutComponent } from './components/b-layout/b-layout.component';
import { BLeadsComponent } from './components/b-leads/b-leads.component';
import { BVisitsComponent } from './components/b-visits/b-visits.component';
import { BQuoteComponent } from './components/b-quote/b-quote.component';
import { OrdersLayoutComponent } from './components/orders-layout/orders-layout.component';
import { GroceryOrdersComponent } from './components/grocery-orders/grocery-orders.component';

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
    path: 'calculator',
    component: CalculatorComponent,
  },
  {
    path: 'task_tracker',
    component: TaskTrackerComponent,
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
        path: 'visits',
        component: VisitsComponent,
      },
      {
        path: 'notifications',
        component: CreateNotificationsComponent,
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
          {
            path: 'doctor',
            component: DoctorAppointmentComponent,
          },
          {
            path: '',
            component: SelectServiceComponent
          }
        ],
      },
      {
        path: 'orders-layout',
        component: OrdersLayoutComponent,
        children: [
          {
            path: 'orders',
            component: OrdersComponent,
          },
          {
            path: 'grocery-orders',
            component: GroceryOrdersComponent,
          },
          {
            path: '',
            component: GroceryOrdersComponent
          }
        ]
      }
    ],
  },
  {
    path: 'brahmadev-constructions',
    component: BrahmadevConstructionsComponent,
  },
  {
    path: 'b-layout',
    component: BLayoutComponent,
    children: [
      {
    path: 'b-leads',
    component: BLeadsComponent,
  },
      {
    path: 'b-visits',
    component: BVisitsComponent,
  },
      {
    path: 'b-quote',
    component: BQuoteComponent,
  },
  {
    path: '',
    redirectTo: 'b-leads',
    pathMatch: 'full',
  },
    ]
  },
  {
    path: '**',
    component: NotfoundComponent,
  },
];
