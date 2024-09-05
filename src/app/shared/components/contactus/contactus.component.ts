import { CommonModule } from '@angular/common';
import { DropdownValues } from './../../interfaces/response-api';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [TranslateModule,CommonModule],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent {
  lang: any;
technicalFlag:boolean=false;
otherFlag:boolean=false;
claimFlag:boolean=false;

  constructor(private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    console.log('technical',this.technicalFlag)
    this.snapshotUrl();
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }
  
toggleFlag(index:number)
{
 if(index===1)
 {
  this.technicalFlag=true;
  this.claimFlag =false;
  this.otherFlag = false;
}
else if(index===2)
{
  this.claimFlag =true;
  this.otherFlag =false;
  this.technicalFlag = false;
}
else
{
  this.otherFlag = true;
  this.claimFlag =false;
  this.technicalFlag = false;
}
}

}
