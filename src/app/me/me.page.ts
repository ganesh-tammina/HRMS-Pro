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
  IonIcon
} from '@ionic/angular/standalone';
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
    IonIcon
  ]
})
export class MePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
