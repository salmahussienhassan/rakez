import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountinfoService } from '../../../../../../shared/services/accountinfo.service';
import { RegistrationDataService } from '../../../../../../shared/services/registration-data.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [TranslateModule,CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
  lang:any;
  currentUrl:string = '';
  showAddress: boolean[] = [];
  previousAddress:boolean=false;
  address:any;
  registrationData:any;
  registerData:any;
  userData:any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
  private accountService: AccountinfoService ) {
   
  }
  ngOnInit(): void {

    this.registerData = localStorage.getItem('registerData');
    if(this.registerData !==  "[object Object]"){
      this.userData = JSON.parse(this.registerData);
      this.registrationData = this.userData;
      console.log("registrationData", this.registrationData);
    }
    
    this.snapshotUrl();
    this.nationalAddress();
  }
  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
      this.currentUrl = this.activatedRoute.snapshot.url.join('/').substring(3);
    })
  }

  showPreviousAddress()
  {
    this.previousAddress=!this.previousAddress
  }

  nationalAddress(){
    this.accountService.nationalAddress(this.registrationData.identityNumber , this.registrationData.birthdate).subscribe((res)=>{
      this.address = res.data.personNationalAddressInfo.Addresses;
      console.log(this.address)
    })
  }
}
