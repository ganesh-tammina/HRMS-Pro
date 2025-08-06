import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from '../shared/header/header.component';
@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class PostPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
