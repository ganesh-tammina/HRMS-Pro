import { Component, OnInit } from '@angular/core';
import { OnboardingMainheaderComponent } from '../onboarding-mainheader/onboarding-mainheader.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-new-joiner',
  templateUrl: './new-joiner.component.html',
  styleUrls: ['./new-joiner.component.scss'],
  standalone: true,
  imports: [OnboardingMainheaderComponent, IonicModule, HeaderComponent]
})
export class NewJoinerComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
