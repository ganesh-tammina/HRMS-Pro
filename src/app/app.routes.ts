import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { MePage } from './me/me.page';
import { MyTeamPage } from './my-team/my-team.page';
import { logIn } from 'ionicons/icons';
import { LoginPage } from './login/login.page';
import { OnboardingPage } from './post-onboarding/post-onboarding.page';
import { PostPage } from './onboarding/pre.page';
import { PreonboardingComponent } from './onboarding/preonboarding/preonboarding.component';
import { NewJoinerComponent } from './onboarding/new-joiner/new-joiner.component';
import { PastOffersComponent } from './onboarding/past-offers/past-offers.component';
import { OnboardingTasksComponent } from './onboarding/onboarding-tasks/onboarding-tasks.component';
import { CandiateCreateComponent } from './onboarding/candiate-create/candiate-create.component';
import { StartOnboardingComponent } from './onboarding/start-onboarding/start-onboarding.component';
import { CreateOfferComponent } from './onboarding/create-offer/create-offer.component';
import { LeavesComponent } from './me/leaves/leaves.component';
import { salaryStaructureComponent } from './salary-staructure/salary-staructure.component';
import { authGuard } from './authgurd.guard';

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
  { path: 'settings', component: PostPage },
  { path: 'preOnboarding', component: PreonboardingComponent },
  { path: 'NewJoiner', component: NewJoinerComponent },
  { path: 'pastOffers', component: PastOffersComponent },
  { path: 'onboarding_Tasks', component: OnboardingTasksComponent },
  { path: 'CandiateCreate', component: CandiateCreateComponent },
  { path: 'Startonboardingitem', component: StartOnboardingComponent },
  { path: 'CreateOffer/:id/:FirstName', component: CreateOfferComponent },
  { path: 'leaves', component: LeavesComponent },


  {
    path: 'pre_onboarding',
    loadComponent: () => import('./onboarding/pre.page').then(m => m.PostPage),
    canActivate: [authGuard]
  },
  {
    path: 'post-onboarding',
    loadComponent: () => import('./post-onboarding/post-onboarding.page').then(m => m.OnboardingPage)
  },

  {
    path: 'Task_Template', loadComponent: () => import('./onboarding/task-templates/task-templates.component').then(m => m.TaskTemplatesComponent)
  },
  {
    path: 'setup', loadComponent: () => import('./onboarding/setup/setup.component').then(m => m.SetupComponent)
  },
  {
    path: 'Compensation/:id/:', loadComponent: () => import('./onboarding/compensation/compensation.component').then(m => m.CompensationComponent)
  },
  {
    path: 'salaryStaructure',
    loadComponent: () =>
      import('./salary-staructure/salary-staructure.component').then(
        m => m.salaryStaructureComponent
      ),
  }




];
