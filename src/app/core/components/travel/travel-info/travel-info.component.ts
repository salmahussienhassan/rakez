import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SoonComponent } from '../../../../shared/components/soon/soon.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-travel-info',
  standalone: true,
  imports: [SoonComponent, RouterLink, ReactiveFormsModule,FormsModule, CommonModule, HttpClientModule, TranslateModule],
  templateUrl: './travel-info.component.html',
  styleUrl: './travel-info.component.css'
})
export class TravelInfoComponent {

  constructor(private router: Router){}
}
