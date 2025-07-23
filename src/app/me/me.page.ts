import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderPage } from '../header/header.page';
@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, HeaderPage, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
