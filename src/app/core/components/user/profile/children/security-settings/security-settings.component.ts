import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarProfileComponent } from '../../../../../../shared/components/progress-bar-profile/progress-bar-profile.component';
import { AccountinfoService } from '../../../../../../shared/services/accountinfo.service';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [ProgressBarProfileComponent,CommonModule,FormsModule,ReactiveFormsModule,TranslateModule],
  templateUrl: './security-settings.component.html',
  styleUrl: './security-settings.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SecuritySettingsComponent {
  passwordMessage!:string;
  code:string=''
  EmailPasswordFlag:boolean=false
  VerifyPasswordFlag:boolean=false
  ChangPasswordFlag:boolean=false
  passwordPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  message: string = '';
  email:any;
  UpdatePasswordFlag:boolean=false;
  succussFlagEmail:boolean=false;
  PasswordTitle:boolean=false;
  lang:any;
  constructor(private accountInfoService:AccountinfoService,private router:Router,
    private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.email=localStorage.getItem('email')
    this.snapshotUrl();
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }

  ChangePassword(){
    this.PasswordTitle= !this.PasswordTitle
    this.EmailPasswordFlag= !this.EmailPasswordFlag
    this.ChangPasswordFlag = !this.ChangPasswordFlag
  }

  UpdatePasswordForm=new FormGroup({
    newPassword: new FormControl('',[Validators.required,Validators.pattern(this.passwordPattern) ]),
    confirmPassword: new FormControl('',[Validators.required ]),
  })

  PasswordOtpForm=new FormGroup({
    input1:new FormControl('',[Validators.required]),
    input2:new FormControl('',[Validators.required]),
    input3:new FormControl('',[Validators.required]),
    input4:new FormControl('',[Validators.required]),
    input5:new FormControl('',[Validators.required]),
    input6:new FormControl('',[Validators.required]),
  })
  
  SendPasswordOtp(){
   
    this.accountInfoService.SendPasswordOtp().subscribe({
      next:(res)=>{
        this.EmailPasswordFlag= !this.EmailPasswordFlag
        this.VerifyPasswordFlag= !this.VerifyPasswordFlag
        this.accountInfoService.Flag.next('2')
        console.log(res)
      },
      error:(err)=>{
        console.log(err)
      }
    })
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
     console.log(this.code)
     this.accountInfoService.Flag.next('3')
    this.VerifyPasswordFlag = !this.VerifyPasswordFlag
    this.UpdatePasswordFlag =!this.UpdatePasswordFlag
    
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
      this.UpdatePasswordFlag = !this.UpdatePasswordFlag
    this.succussFlagEmail = !this.succussFlagEmail
    this.accountInfoService.Flag.next('0')
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
this.passwordMessage='The Password and Confirm Password Doesnt Match'
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
