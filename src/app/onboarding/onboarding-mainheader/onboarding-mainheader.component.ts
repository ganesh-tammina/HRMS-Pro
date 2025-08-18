import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-mainheader',
  templateUrl: './onboarding-mainheader.component.html',
  styleUrls: ['./onboarding-mainheader.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class OnboardingMainheaderComponent implements OnInit {
  isActive: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() { }
  gotemplates() {
    this.router.navigate(['/Task_Template']);
  }
  goSettings() {
    this.router.navigate(['/settings']);
  }
  goSetup() {
    this.isActive = true; // Apply the active class
    this.router.navigate(['/setup'], { queryParams: { active: true } });
  }
  gopreboarding() {
    this.router.navigate(['/preOnboarding']);
  }
  goNewJoiners() {
    this.router.navigate(['/NewJoiner']);
  }
  goPastOffers() {
    this.router.navigate(['/pastOffers']);
  }
  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Navigates to the Onboarding Tasks page.
   *
   * @return {void} Does not return anything.
   */
  /*******  17eada39-84de-4129-a24b-141491f890d7  *******/
  goOnboardingTasks() {
    this.isActive = !this.isActive;
    this.router.navigate(['/onboarding_Tasks']);
  }
}
