import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-soon',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule,FormsModule, CommonModule, HttpClientModule, TranslateModule],
  templateUrl: './soon.component.html',
  styleUrl: './soon.component.css'
})
export class SoonComponent {

}
