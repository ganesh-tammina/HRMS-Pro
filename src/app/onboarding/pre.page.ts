import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonModal,
  IonInput, IonCheckbox, IonButton, IonButtons,
  IonToolbar, IonLabel, IonItem, IonSelectOption, IonSelect
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../shared/header/header.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreOnboardingService } from '../services/pre-onboarding.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-post',
  templateUrl: './pre.page.html',
  styleUrls: ['./pre.page.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent,
    IonInput, IonCheckbox, IonButton, IonSelectOption, IonModal, IonSelect, IonLabel, IonItem,
    IonHeader, IonTitle, IonToolbar, HttpClientModule, IonButtons, CommonModule, HeaderComponent, FormsModule, ReactiveFormsModule],
})
export class PostPage implements OnInit {
  selectedCard: string | null = '';
  personalForm!: FormGroup;
  showPreviewModal: boolean = false;
  previewUrl: string | null = null;
  previewUrls: SafeResourceUrl | null = null;
  previewType: 'image' | 'pdf' | 'unsupported' = 'unsupported';

  uploadedDocs: { [key: string]: boolean } = {
    aadhar: false,
    pan: false,
    photo: false,
    resume: false,
  };

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private sanitizers: DomSanitizer,
    private service: PreOnboardingService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.personalForm = this.fb.group({
      personalDetails: this.fb.group({
        fullName: ['', Validators.required],
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/)
        ]]
      }),
      documents: this.fb.group({
        AadharCard: ['', Validators.required],
        PANCard: ['', Validators.required],
        photo: ['', Validators.required],
        resume: ['', Validators.required]
      }),
      previousCompany: this.fb.group({
        CompanyName: ['', Validators.required],
        Role: ['', Validators.required],
        Reason: ['', Validators.required]
      })
    });
  }

  openCard(card: string) {
    this.selectedCard = card;
  }

  onNext(nextCard: string) {
    this.openCard(nextCard);
  }

  onCancel() {
    this.personalForm.reset();
    this.openCard('personal');
  }

  generateCandidateId(): string {
    const date = new Date();
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CAND${yyyy}${mm}${dd}${random}`;
  }

  onSubmit() {
    if (this.personalForm.valid) {
      const { personalDetails, documents, previousCompany } = this.personalForm.value;
      const candidateId = this.generateCandidateId();

      const data = {
        candidateId,
        ...personalDetails,
        ...documents,
        ...previousCompany
      };

      this.http.post('http://localhost:3000/employees', data).subscribe(
        async (response) => {
          console.log('Data saved successfully:', response);
          this.personalForm.reset();
          this.openCard('personal');
          const message = `Pre Onboarding completed successfully!\nCandidate ID: ${candidateId}`;
          const alert = await this.alertController.create({
            header: 'Confirmation',
            message: message,
            buttons: ['OK']
          });

          await alert.present();
        },
        error => {
          console.error('Error while saving data:', error);
        }
      );
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  async onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.uploadedDocs[type] = true;

    const fileType = file.type;
    const reader = new FileReader();

    reader.onload = () => {
      if (fileType.startsWith('image/')) {
        this.previewType = 'image';
        this.previewUrl = reader.result as string;
      } else if (fileType === 'application/pdf') {
        this.previewType = 'pdf';
        this.previewUrls = this.sanitizers.bypassSecurityTrustResourceUrl(reader.result as string);
      } else {
        this.previewType = 'unsupported';
        this.previewUrl = null;
      }

      this.showPreviewModal = true;

      if (this.areAllDocumentsUploaded()) {
        this.showConfirmationAlert();
      }
    };

    reader.readAsDataURL(file);
  }

  areAllDocumentsUploaded(): boolean {
    return Object.values(this.uploadedDocs).every((uploaded) => uploaded);
  }

  async showConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'All documents have been uploaded. Do you want to continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Next',
          handler: () => {
            this.openCard('Previous_Company');
          },
        },
      ],
    });

    await alert.present();
  }

  closePreview() {
    this.showPreviewModal = false;
    this.previewUrl = null;
    this.previewType = 'unsupported';
  }
}
