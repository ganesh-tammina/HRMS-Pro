import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { CreateOfferHeaderComponent } from '../onboarding/create-offer-header/create-offer-header.component';

@Component({
  selector: 'app-salary-structure',
  templateUrl: './salary-staructure.component.html',
  styleUrls: ['./salary-staructure.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent,
    CreateOfferHeaderComponent,
  ],
})
export class salaryStaructureComponent implements OnInit {
  annualSalary: number = 600000;
  salaryStructure: any = {};
  candidate: any = {};
  salaryForm!: FormGroup;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.candidate = nav?.extras.state?.['candidate'] || {};
    console.log('Candidate:', this.candidate);
  }

  ngOnInit() {
    this.calculateSalary();
  }

  calculateSalary() {
    const basic = this.annualSalary * 0.40;
    const hra = this.annualSalary * 0.16;
    const medical = 15000;
    const transport = 19200;
    const special = this.annualSalary - (basic + hra + medical + transport);

    const pfEmployer = basic * 0.12;
    const pfEmployee = basic * 0.12;

    this.salaryStructure = {
      basic,
      hra,
      medical,
      transport,
      special,
      subtotal: basic + hra + medical + transport + special,
      pfEmployer,
      pfEmployee,
      total: basic + hra + medical + transport + special + pfEmployer,
    };
  }

  onViewSalary() {
    this.calculateSalary();
  }

  goToOfferDetails() {
    // Save salary into candidate before navigating
    this.candidate.salary = {
      annualSalary: this.annualSalary,
      salaryStructure: this.salaryStructure
    };

    this.router.navigate(
      ['/OfferDetailsComponent', this.candidate.id, encodeURIComponent(this.candidate.personalDetails.FirstName)],
      { state: { candidate: this.candidate } }
    );
  }
}
