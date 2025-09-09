import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-offer-header',
  templateUrl: './create-offer-header.component.html',
  styleUrls: ['./create-offer-header.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class CreateOfferHeaderComponent implements OnInit {

  @Output() continueClick = new EventEmitter<void>(); // Event to notify parent
  isActive: boolean = false;
  isTasksTemplate: boolean = false;
  activeTab = '';
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects.split('/').pop();
        this.activeTab = url; // match last part of the URL
      });
  }

  ngOnInit() { }

  onContinue() {
    this.continueClick.emit(); // Emit event to parent
  }



  navigate(tab: string) {
    this.activeTab = tab;
    this.router.navigate(['/' + tab]); // navigates to /settings or /profile
  }

}
