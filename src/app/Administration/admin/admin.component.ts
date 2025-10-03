import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AdminComponent implements OnInit {
  selectedFile: File | null = null;
  EmployeeselectedFile: File | null = null;
  constructor(private http: HttpClient) { }

  ngOnInit() { }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  EmployeeSelected(event: any) {
    this.EmployeeselectedFile = event.target.files[0];
    console.log(this.EmployeeselectedFile);
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
  EmployeesUpload() {
    if (!this.EmployeeselectedFile) return;
    const formData = new FormData();
    formData.append("file", this.EmployeeselectedFile);
    this.http.post("http://30.0.0.221:3562/existingemployees", formData).subscribe({
      next: (res) => {
        console.log(res);
        alert("Upload successful!");

      },
      error: (err) => {
        console.error(err);
        alert("Upload failed!");
      }
    });
    this.http.post("http://30.0.0.221:3562/existingemployees", formData)
      .subscribe((res: any) => console.log(res), (err: any) => console.error(err));
  }
}
