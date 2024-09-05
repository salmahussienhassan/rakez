import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [TranslateModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent {
  driverName!:string;
  lang:any;
test:any=[1,2,3,4]


  constructor(private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.snapshotUrl();
    // this.driverName = localStorage.getItem('name');
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }

}
