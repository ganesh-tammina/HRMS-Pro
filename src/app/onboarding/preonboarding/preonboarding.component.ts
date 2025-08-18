import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OnboardingMainheaderComponent } from '../onboarding-mainheader/onboarding-mainheader.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';


@Component({
  selector: 'app-preonboarding',
  templateUrl: './preonboarding.component.html',
  styleUrls: ['./preonboarding.component.scss'],
  standalone: true,
  imports: [OnboardingMainheaderComponent, IonicModule, HeaderComponent]
})
export class PreonboardingComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
