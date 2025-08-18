import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-mainheader',
  templateUrl: './onboarding-mainheader.component.html',
  styleUrls: ['./onboarding-mainheader.component.scss'],
  standalone: true,
  imports: [IonicModule,]
})
export class OnboardingMainheaderComponent implements OnInit {
  isActive = false;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() { }
  gopreboarding() {
    this.router.navigate(['/Task_Template']);
  }
  goSettings() {
    this.router.navigate(['/settings']);
  }
  goSetup() {
    this.isActive = true; // Apply the active class
    this.router.navigate(['/setup'], { queryParams: { active: true } });
  }
}
