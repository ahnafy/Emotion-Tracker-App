// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from './users/user-list.component';
import {ResourcesComponent} from "./resources/resources.component";
import {ReportsComponent} from "./reports/reports.component";
import {JournalingComponent} from "./journaling/journaling.component";
import {GoalsComponent} from "./goals/goals.component";
import {JournalListComponent} from "./journals/journal-list.component";

// Route Configuration
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'journaling', component: JournalingComponent},
    {path: 'journals', component: JournalListComponent},
    {path: 'resources', component: ResourcesComponent },
    {path: 'reports', component: ReportsComponent },
    {path: 'goals', component: GoalsComponent },

];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
