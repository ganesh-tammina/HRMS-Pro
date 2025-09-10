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

  @Output() continueClick = new EventEmitter<void>();
    @Output() createOfferClick = new EventEmitter<void>();

  activeTab = '';
    isPreviewSend = false;
  candidateId: string | null = null;
  firstName: string | null = null;
   

  // preview_send = false
   currentRoute: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    // track active tab by URL
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const segments = event.urlAfterRedirects.split('/');
        this.activeTab = segments[segments.length - 1];
        this.isPreviewSend = this.activeTab === 'preview_send'
      //        if (event instanceof NavigationEnd) {
      //   this.currentRoute = event.url;
      // }
      });
  }

  ngOnInit() {
    // get id & firstName from parent route
 this.candidateId = this.route.snapshot.paramMap.get('id');
    this.firstName = this.route.snapshot.paramMap.get('FirstName');
  }

  onContinue() {
    this.continueClick.emit();
  }
  onCreateOffer() {
    this.createOfferClick.emit(); // You can handle final API call or navigation here
  }

  navigate(tab: string) {
    if (this.candidateId && this.firstName) {
      this.router.navigate(['/', tab, this.candidateId, this.firstName]);
    } else {
      console.error('Missing route params: id or firstName');
    }
  }
}
