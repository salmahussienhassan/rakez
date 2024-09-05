import { Component } from '@angular/core';
import { SoonComponent } from '../../../../shared/components/soon/soon.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-medical-info',
  standalone: true,
  imports: [SoonComponent, RouterLink,ReactiveFormsModule,FormsModule, CommonModule, HttpClientModule, TranslateModule],
  templateUrl: './medical-info.component.html',
  styleUrl: './medical-info.component.css'
})
export class MedicalInfoComponent {
  constructor(private router: Router){}
}
