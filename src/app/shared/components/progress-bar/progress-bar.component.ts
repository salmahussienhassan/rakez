import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LangService } from '../../services/lang.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css'
})
export class ProgressBarComponent implements OnInit {
  activeIcon: string = ''
  constructor(private dataService:DataService,private router: Router,private langService:LangService) { }

  ngOnInit(): void {
    this.activeIcon = this.dataService.getActiveIcon();
    console.log(this.activeIcon);
    
  }
  
  onIconClick(component: string) {
    this.dataService.setActiveIcon(component);
    this.router.navigate([`/${component}`]);
  }
}
