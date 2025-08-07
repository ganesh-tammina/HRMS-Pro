import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonIcon,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonLabel,
  IonItem
} from '@ionic/angular/standalone';
@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonSearchbar,
    IonIcon,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonItem,
    IonLabel,
  ]

})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
