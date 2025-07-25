import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { MePage } from './me/me.page';
import { MyTeamPage } from './my-team/my-team.page';
import { logIn } from 'ionicons/icons';
import { LoginPage } from './login/login.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'Home', component: HomePage },
  { path: 'Me', component: MePage },
  { path: 'MyTeam', component: MyTeamPage },
  { path: 'login', component: LoginPage },

];
