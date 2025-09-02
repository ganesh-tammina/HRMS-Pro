import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CreateOfferHeaderComponent } from '../create-offer-header/create-offer-header.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';

@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss'],
  standalone: true,
  imports: [IonicModule, HeaderComponent,
    CreateOfferHeaderComponent]
})
export class CompensationComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
