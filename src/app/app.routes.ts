import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { MePage } from './me/me.page';
import { MyTeamPage } from './my-team/my-team.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'Home', component: HomePage },
  { path: 'Me', component: MePage },
  { path: 'MyTeam', component: MyTeamPage },

  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },



];
