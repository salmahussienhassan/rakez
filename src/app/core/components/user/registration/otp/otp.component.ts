import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { VerifyOtp } from '../interfaces/verify-otp';
import { RegistrationApiService } from '../registration-api.service';
import { ForgetPass } from '../interfaces/forget-pass';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, FormsModule, RouterLink,TranslateModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {
  
 otpForm!: FormGroup;
 otpBody!:VerifyOtp;
 resendCodeBody!:ForgetPass;
 serverSideError!:string;
 emailVal:any;
 isResendDisabled = true;
minutes: number = 0;
seconds: number = 0;
interval: any;
lang:any;
currentUrl:string = '';
otpCode: any;
registerData:any;
userData:any;
identityNumber:any;

constructor(private fb: FormBuilder, private router: Router,private activatedRoute:ActivatedRoute,private otp: RegistrationApiService){}

ngOnInit(): void {
  this.snapshotUrl();
   this.otpForm = this.fb.group({
   code : ['', Validators.required],
  });

  this.startTimer();

  this.registerData = localStorage.getItem('registerData');
  if(this.registerData !==  "[object Object]"){
    this.userData = JSON.parse(this.registerData);
    this.identityNumber = this.userData.identityNumber;
    this.emailVal = this.userData.email;
    console.log("registrationData", this.userData);
  }

}

snapshotUrl(){
  this.activatedRoute.paramMap.subscribe(params => {
    this.lang = params.get('lang');
    this.currentUrl = this.activatedRoute.snapshot.url.join('/').substring(3);
  })
}

login(){
  this.router.navigate([`${this.lang}/login`])
}

startTimer(): void {
  this.minutes =1;
  this.seconds = 0;
  this.isResendDisabled = true;

  this.interval = setInterval(() => {
    if (this.seconds === 0 && this.minutes === 0) {
      this.clearTimer();
    } else {
      if (this.seconds === 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
    }
  }, 1000);
}


clearTimer(): void {
  clearInterval(this.interval);
  this.isResendDisabled = false;
}



 get code(){return this.otpForm.get('code')}

  ValidateNumber(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    const isNumber = charCode >= 48 && charCode <= 57;
    if (!isNumber) {
      event.preventDefault();
    }
  }

  resendCode(){
    if(!this.isResendDisabled){
      this.startTimer();
    this.resendCodeBody = {
      email: this.emailVal,
    }

    this.otp.postResendOtp(this.resendCodeBody).subscribe((res:any)=>{
      if(res.statusCode == 200){
        console.log('success');
      }
      else if(res.statusCode == 204){
        //empty data
        this.serverSideError = res.message;
      }
      else if(res.statusCode == 400){
        //data erro
        this.serverSideError = res.message;
      }
      else{
        this.serverSideError = res.message;
      }
    },
    (err:any) => {
      this.serverSideError = err.error.message;
    }
  );
    }
    else{
      this.otpForm.markAllAsTouched();
    }
}

  onSubmit(){
    if(this.otpCode){
      if(this.otpCode.length > 5){
        this.otpBody = {
          email: this.emailVal,
          otp: this.otpForm.controls["code"].value,
        }
        this.otp.postVerifyOtp(this.otpBody).subscribe((data:any)=>{
          if(data.statusCode == 200){
            this.router.navigate([`${this.lang}/reset-password`])
          }
          else if(data.statusCode == 204){
            this.serverSideError = data.message;
          }
          else if(data.statusCode == 400){
            this.serverSideError = data.message;
          }
          else{
            this.serverSideError = data.message;
          }
        },
        (err:any) => {
          this.serverSideError = err.error.message;
        }
       );}
    
       else {
         return;
       }
    }
  
  }
}
