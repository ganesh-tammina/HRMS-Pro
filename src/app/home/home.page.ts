import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import moment from 'moment';
// ✅ Import all Ionic components you are using

import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
   HeaderComponent,
   IonicModule
   
  ]
})
export class HomePage implements OnInit {
  days: { date: string, status: 'Complete' | 'Remaining' }[] = [];
  
  constructor() { }
  ngOnInit() {
    const today = moment();
    for (let i = 0; i < 7; i++) {
      const day = today.clone().add(i, 'days');
      const status = day.isBefore(moment(), 'day') ? 'Complete' : 
                     day.isSame(moment(), 'day') ? 'Complete' : 
                     'Remaining';
      this.days.push({
        date: day.format('ddd'),
        status
      });
    }
   }
  backgroundImageUrl: string = '../../assets/holidays-pics/holidays-img.svg';  
}





