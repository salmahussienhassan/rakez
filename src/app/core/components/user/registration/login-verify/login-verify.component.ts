import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResponseApi, registrationResponse } from '../../../../../shared/interfaces/response-api';
import {ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ForgetPass } from '../interfaces/forget-pass';

import { RegistrationApiService } from '../registration-api.service';
import { AccountinfoService } from '../../../../../shared/services/accountinfo.service';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
import { RegistrationDataService } from '../../../../../shared/services/registration-data.service';

@Component({
  selector: 'app-login-verify',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, TranslateModule, NgxOtpInputComponent],
  templateUrl: './login-verify.component.html',
  styleUrl: './login-verify.component.css'
})
export class LoginVerifyComponent {
  otpForm!: FormGroup;
  resendCodeBody!:ForgetPass;
  serverSideError!:string;
  emailVal:any;
  isResendDisabled = true;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  lang:any;
  currentUrl:string = '';
  identityNumber:any;
  otpCode: any;
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength: 6,
    autoFocus: true,
    autoBlur: true,
  };
  registerData:any;
  userData:any;

  constructor(private fb: FormBuilder, private router: Router,private loginVerify: RegistrationApiService,
  private accountService:AccountinfoService,private activatedRoute:ActivatedRoute){}

ngOnInit(): void {
  this.snapshotUrl();
   this.otpForm = this.fb.group({
   otp : ['', Validators.required],
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
    this.router.navigate([`${this.lang}/login-verify`])
  })
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

  otpComplete(otp: any) {
    this.otpCode = otp.join("");
  }


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
        this.resendCodeBody = {email: this.emailVal, }

        this.loginVerify.postResendOtp(this.resendCodeBody).subscribe((res:any)=>{
          if(res.statusCode == 200){
            // this.router.navigate(["/check-email"]);
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
  }

  onSubmit(){
    if(this.otpCode){
      if(this.otpCode.length > 5){
      this.loginVerify.postLogin2AF(this.otpCode, this.identityNumber).subscribe((res:any)=>{
        if(res.statusCode == 200){
          this.registerData = JSON.stringify(res.data)
            localStorage.setItem('registerData' , this.registerData);
          this.accountService.token = res.data.token;
          this.router.navigate([`${this.lang}/home`]);
        }
        else if(res.statusCode == 204){
          this.serverSideError = res.message;
        }
        else if(res.statusCode == 400){
          this.serverSideError = res.message;
          console.log(res);

        }
        else{
          this.serverSideError = res.message;
          console.log(res);
        }
      },
      (err:any) => {
        this.serverSideError = err.error.message;
      }
      );}

      else{
        // this.verfiyEmailForm.markAllAsTouched();
        return;
      }
   }
  }
}
