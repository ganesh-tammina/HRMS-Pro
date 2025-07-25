import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ✅ Import all Ionic components you are using
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
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
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
export class HomePage implements OnInit {
  constructor() { }
  ngOnInit() { }
}
