
import { AccountInfoComponent } from './../../../core/components/user/profile/children/account-info/account-info.component';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccountinfoService } from '../../services/accountinfo.service';

@Component({
  selector: 'app-progress-bar-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar-profile.component.html',
  styleUrl: './progress-bar-profile.component.css'
})
export class ProgressBarProfileComponent {
  CheckFlag!:string;
  Flag1:boolean=false;
  Flag2:boolean=false;

  constructor(private accountInfoService:AccountinfoService){  }

ngOnInit(): void {
  
  this.accountInfoService.Flag.subscribe(
    val=>
      {this.CheckFlag=val

        if(this.CheckFlag=='2'){
          this.Flag1 = !this.Flag1
        }
        if(this.CheckFlag=='3'){
          this.Flag2 = !this.Flag2
        }
        
      }
  )
  
  

}

}
