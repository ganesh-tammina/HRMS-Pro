import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LeaveModalComponent } from './leave-modal/leave-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, LeaveModalComponent]
})
export class AdminComponent implements OnInit {
  selectedFile: File | null = null;
  showModal = false;
  leaveData: any = null;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    const savedData = localStorage.getItem('leaveData');
    if (savedData) {
      this.leaveData = JSON.parse(savedData);
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  Upload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append("file", this.selectedFile);

    this.http.post("http://30.0.0.78:3562/holidays/public_holidays", formData).subscribe({
      next: (res) => {
        console.log(res);
        alert("Upload successful!");

      },
      error: (err) => {
        console.error(err);
        alert("Upload failed!");
      }
    });
    this.http.post("http://30.0.0.78:3562/upload-holidays", formData)
      .subscribe((res: any) => console.log(res), (err: any) => console.error(err));
  }
  openModal() {
    this.showModal = true;
  }

  handleSave(leaves: any) {
    this.leaveData = leaves;
    localStorage.setItem('leaveData', JSON.stringify(leaves));
    
    this.showModal = false;
  }

  handleClose() {
    this.showModal = false;
  }
  deleteLeaves() {
    this.leaveData = null;
    localStorage.removeItem('leaveData');
  }
}
