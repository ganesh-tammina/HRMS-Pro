import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateOfferHeaderComponent } from '../create-offer-header/create-offer-header.component';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { Router } from '@angular/router';
import { CandidateService } from 'src/app/services/pre-onboarding.service';

@Component({
  selector: 'app-offer-letter',
  standalone: true,
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateOfferHeaderComponent,
    HeaderComponent
  ]
})
export class OfferDetailsComponent implements OnInit {

  selectedOption: string = 'template'; // default
  selectedTemplate: string = 'SVS';   // default
  previewText: string = '';

  uploadedFileName: string | null = null;
  @Input() candidate: any = {};
  router: any;
  constructor(private route: Router, private fb: FormBuilder, private candidateService: CandidateService) { }
  ngOnInit() {
    this.updatePreview();
  }

  // Switch preview content based on selected template
  updatePreview() {
    if (this.selectedTemplate === 'SVS') {
      this.previewText = `
        Dear {{BasicInfo.FirstName}} {{BasicInfo.LastName}},
        <br><br>
        Welcome to <b>SVS Towers</b>!! <br><br>
        It was a pleasure interacting with you during our hiring process and
        we believe you would make a great asset to {{CompanyInfo.CompanyName}}.
      `;
    } else if (this.selectedTemplate === 'TechTammina') {
      this.previewText = `
        Dear {{BasicInfo.FirstName}} {{BasicInfo.LastName}},
        <br><br>
        Welcome to <b>Tech Tammina</b>!! <br><br>
        We are excited to have you onboard and look forward to seeing the best of your capabilities.
      `;
    }
  }

  // Radio option change
  onOptionChange(event: any) {
    this.selectedOption = event.detail.value;
  }

  // Template dropdown change
  onTemplateChange(event: any) {
    this.selectedTemplate = event.detail.value;
    this.updatePreview();
  }

  // File upload
  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFileName = file.name;
      this.previewText = `<b>Custom Offer Letter uploaded:</b> ${file.name}`;
    }
  }
}
