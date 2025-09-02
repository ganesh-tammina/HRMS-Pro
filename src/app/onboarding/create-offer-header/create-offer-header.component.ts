import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-create-offer-header',
  templateUrl: './create-offer-header.component.html',
  styleUrls: ['./create-offer-header.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class CreateOfferHeaderComponent implements OnInit {

  @Output() continueClick = new EventEmitter<void>(); // Event to notify parent

  constructor() { }

  ngOnInit() { }

  onContinue() {
    this.continueClick.emit(); // Emit event to parent
  }

}
