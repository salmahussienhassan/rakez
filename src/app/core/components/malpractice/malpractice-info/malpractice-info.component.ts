import { Component } from '@angular/core';
import { SoonComponent } from '../../../../shared/components/soon/soon.component';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-malpractice-info',
  standalone: true,
  imports: [SoonComponent, RouterLink, ReactiveFormsModule,FormsModule, CommonModule, HttpClientModule, TranslateModule],
  templateUrl: './malpractice-info.component.html',
  styleUrl: './malpractice-info.component.css'
})
export class MalpracticeInfoComponent {

  constructor(private router: Router){}

  ngOnInit(): void {
  }
}
