import { BehaviorSubject } from 'rxjs';
import { DataService } from './../../services/data.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink,TranslateModule,RouterOutlet,CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  langUrl:any;
  currentUrl: string = '';
  constructor(private activatedRoute:ActivatedRoute,private router: Router, private dataService : DataService ){}
  ngOnInit(): void {
  this.snapshotUrl();
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.dataService.language$.subscribe(data => {
        this.langUrl = data;
      })
    })
  }

  scrollTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
