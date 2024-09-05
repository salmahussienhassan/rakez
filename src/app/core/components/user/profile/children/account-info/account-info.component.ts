import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, interval, take } from 'rxjs';
import { ProgressBarProfileComponent } from '../../../../../../shared/components/progress-bar-profile/progress-bar-profile.component';
import { AccountinfoService } from '../../../../../../shared/services/accountinfo.service';


@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [ProgressBarProfileComponent,CommonModule,FormsModule,ReactiveFormsModule,TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css',

})
export class AccountInfoComponent {
  PhoneOtp:boolean=false
  EmailTitle:boolean=false
  PhoneTitle:boolean=false
  PhoneEditBody:boolean=false
  succussFlagMobile:boolean=false
  mainDevFlag:boolean=false
  succussFlag:boolean=false
  code:string=''
  countdown: number = 28; // Initial countdown value in seconds
  message: string = '';
  subscription!: Subscription;
  PhoneFlag:boolean=false
  EmailEdit:boolean=false
  PhoneEdit:boolean=false
  EmailPasswordFlag:boolean=false
  verifyPasswordFlag:boolean=false
  ChangPasswordFlag:boolean=false
  passwordMessage:string=''
  passwordPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  EnterOtpBodyFlag:boolean=false
  EnterEmailBodyFlag:boolean=false
  verifyEmailBodyFlag:boolean=false
  email:any;
  name:any;
  phoneNumber:any;
  newEmail:string='';
  userInfo:any;
  EnterEmailCorrectFlag:boolean=false;
  verifyEmailCorrectFlag:boolean=false;
  ErrorMessage:string='';
  lang:any;

  PasswordOtpForm=new FormGroup({
    input1:new FormControl('',[Validators.required]),
    input2:new FormControl('',[Validators.required]),
    input3:new FormControl('',[Validators.required]),
    input4:new FormControl('',[Validators.required]),
    input5:new FormControl('',[Validators.required]),
    input6:new FormControl('',[Validators.required]),
  })

  EmailOtpForm=new FormGroup({
    input1:new FormControl('',[Validators.required]),
    input2:new FormControl('',[Validators.required]),
    input3:new FormControl('',[Validators.required]),
    input4:new FormControl('',[Validators.required]),
    input5:new FormControl('',[Validators.required]),
    input6:new FormControl('',[Validators.required]),
  })

  CheckOTPForNewMailForm=new FormGroup({
    input1:new FormControl('',[Validators.required]),
    input2:new FormControl('',[Validators.required]),
    input3:new FormControl('',[Validators.required]),
    input4:new FormControl('',[Validators.required]),
    input5:new FormControl('',[Validators.required]),
    input6:new FormControl('',[Validators.required]),
  })


  UpdatePasswordForm=new FormGroup({
    newPassword: new FormControl('',[Validators.required,Validators.pattern(this.passwordPattern) ]),
    confirmPassword: new FormControl('',[Validators.required ]),
  })

  SendEmailOtpForm=new FormGroup({
    newEmail:new FormControl('',[Validators.required])
  })

  SendMobileOtpForm=new FormGroup({
    newMobile:new FormControl('',[Validators.required])
  })
  
  constructor(private accountInfoService:AccountinfoService,private router:Router,
    private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.snapshotUrl();
    this.userInfo = localStorage.getItem('registerData')
    this.email= JSON.parse(this.userInfo).email;
    this.name=JSON.parse(this.userInfo).displayName;
    this.phoneNumber=JSON.parse(this.userInfo).phoneNumber;
    console.log(this.email)
  }
  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }

  ShowEmailEdit(){
    this.EmailEdit = !this.EmailEdit
  }

  ShowPhoneEdit(){
    this.PhoneEdit = !this.PhoneEdit
    this.PhoneEditBody= !this. PhoneEditBody
  }

  PhoneFlagFunc(){
    this.PhoneFlag =  !this.PhoneFlag
  }

  SendOTPForUserMail(){
  
    this.accountInfoService.SendOTPForUserMail().subscribe({next:(res)=>{
      this.mainDevFlag=true
    this.EmailTitle= !this.EmailTitle
      this.EmailEdit=!this.EmailEdit
      console.log(res)
    },
    error:(err)=>{
      console.log(err)
    }
    })
  }

CheckOTPForUserMail(form:any){

  if(form.status=="VALID"){
   this.message=''
    const valuesArray = Object.values(form.value);
    // Iterate through the object properties
    for (const key in valuesArray.reverse()) {
        if (valuesArray.hasOwnProperty(key)) {
            this.code += valuesArray[key];
        }
    }
    let x={code:this.code}
    console.log(this.code)
this.accountInfoService.CheckOTPForUserMail(x).subscribe({
  next:(res)=>{
    this.code=''
    this.message=''
    this.EmailEdit= !this.EmailEdit
    this.EnterEmailBodyFlag = !this.EnterEmailBodyFlag
    this.accountInfoService.Flag.next('2')
    console.log(res)
  },
  error:(err)=>{
     this.code=''
    this.ErrorMessage=err.error.data
    console.log(err)
  }
})
}
else{
  this.message="this felids required"
}
}

SendOtpToNewMail(form:any){
if(form.status=="VALID"){
  this.accountInfoService.SendOtpToNewMail(form.value.newEmail).subscribe({
    next:(res)=>{
      this.newEmail=form.value.newEmail
      this.accountInfoService.Flag.next('3')
     this.EnterOtpBodyFlag=!this.EnterOtpBodyFlag
     this.EnterEmailBodyFlag=!this.EnterEmailBodyFlag
     console.log(form.value.newEmail)
      this.message=''
      console.log(res)
    },
    error:(err)=>{
      console.log(err)
    }
  })
}
else{
  this.message="this felids required"
}

}

CheckOTPForNewMail(form:any){

  if(form.status=="VALID"){
    this.message=''
     const valuesArray = Object.values(form.value);
     // Iterate through the object properties
     for (const key in valuesArray.reverse()) {
         if (valuesArray.hasOwnProperty(key)) {
             this.code += valuesArray[key];
         }
     }
     let x={
      code:this.code,
      newEmail:this.newEmail
    }
     console.log(x)

     this.accountInfoService.CheckOTPForNewMail(x).subscribe({
next:(res)=>{
  this.accountInfoService.Flag.next('0')
  this.succussFlag= !this.succussFlag
  this.EnterOtpBodyFlag=!this.EnterOtpBodyFlag
  console.log(res)
  localStorage.removeItem('token')
this.router.navigate([`${this.lang}/login`])
},
error:(err)=>{
  this.ErrorMessage=err.error.data
  console.log(err)
}
     })
    }
    else{
      this.message="this felids required"
    }
}

startCountdown() {
    this.subscription = interval(1000).pipe(
      take(this.countdown)
    ).subscribe(secondsPassed => {
      this.countdown -= 1;
      this.message = `يمكنك إعادة الإرسال بعد ${this.countdown} ثانية`;
    }, null, () => {
      this.message = 'يمكنك الآن إعادة الإرسال';
    });
  }

ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

SendPasswordOtp(){
  
this.accountInfoService.SendPasswordOtp().subscribe({
  next:(res)=>{
    this.EmailPasswordFlag=true
    this.verifyPasswordFlag= !this.verifyPasswordFlag
    console.log(res)
  },
  error:(err)=>{
    console.log(err)
  }
})
  }

  ChangePhoneNumber(){
    this.accountInfoService.Flag.next('2')
    this.PhoneEditBody= !this.PhoneEditBody
    this.PhoneOtp = !this.PhoneOtp
    this.accountInfoService.Flag.next('0')
  }

  CheckPhoneOtp(){
    this.accountInfoService.Flag.next('3')
    this.PhoneOtp = !this.PhoneOtp
    this.succussFlagMobile =!this.succussFlagMobile
    this.accountInfoService.Flag.next('0')
  }

VerifyPasswordOtp(form:any){
  
    console.log(form)
   if(form.status=='VALID'){
    this.passwordMessage=''
    const valuesArray = Object.values(form.value);
    // Iterate through the object properties
    for (const key in valuesArray.reverse()) {
        if (valuesArray.hasOwnProperty(key)) {
            this.code += valuesArray[key];
        }
    }
    let x={code:this.code}
    console.log(form.value)
 
        console.log(this.code)
this.accountInfoService.VerifyPasswordOtp(x).subscribe({
  next:(res)=>{
     this.code=''
    this.EmailPasswordFlag=true
    this.verifyPasswordFlag= !this.verifyPasswordFlag
    this.ChangPasswordFlag= !this.ChangPasswordFlag
    
    console.log(res)
  },
  error:(err)=>{
     this.code=''
    console.log(err)
  }
  
})
   }

  }

  UpdatePassword(form:any){
  console.log(form)
   if(form.status=='VALID'){
  if(form.get('newPassword')?.value ==form.get('confirmPassword')?.value){

  let body={
    newPassword: form.value.newPassword,
    confirmPassword: form.value.confirmPassword,
    otp: this.code
  }
  console.log(body)
  this.accountInfoService.UpdatePassword(body).subscribe({
    next:(res)=>{
       this.code=''
      console.log(res)
    },
    error:(err)=>{
       this.code=''
      console.log(err)
      this.passwordMessage=err.message
    }
  })

}
else{
this.passwordMessage='The Password and Confirm Password Does not Match'
}
   }

   else{
    this.passwordMessage='Enter Correct Password'
   }
  }

  DeleteUser(){
    this.accountInfoService.DeleteUser().subscribe({
      next:(res)=>{
        console.log(res)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

}
