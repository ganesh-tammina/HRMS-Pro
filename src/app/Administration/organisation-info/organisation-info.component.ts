import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-organisation-info',
  templateUrl: './organisation-info.component.html',
  styleUrls: ['./organisation-info.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class OrganisationInfoComponent implements OnInit {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  constructor() { }

  ngOnInit() { }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  onUpload() {
    if (!this.selectedFile) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
    };

    reader.readAsDataURL(this.selectedFile); // Converts file to Base64
  }
}
