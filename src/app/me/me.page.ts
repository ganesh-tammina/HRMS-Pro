import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonIcon,
  IonLabel,
  IonButtons,
  IonToggle,
  IonTitle,
  IonTabs,
  IonTabButton,
  IonTabBar
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../shared/header/header.component';
@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
  standalone: true,
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
    IonTitle,
    IonIcon,
    IonLabel,
    IonButtons,
    IonToggle,
    IonTabs,
    IonTabBar,
    IonTabButton,
    HeaderComponent

  ]
})
export class MePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
