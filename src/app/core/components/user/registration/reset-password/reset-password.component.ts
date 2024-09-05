import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ResetPass } from '../interfaces/reset-pass';
import { RegistrationApiService } from '../registration-api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, FormsModule, RouterLink,TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  resetPassForm!: FormGroup;
  passwordType1: string = 'password';
  passwordType2: string = 'password';
  resetPassBody!:ResetPass;
  emptyData!:string
  dataError!:string 
  serverSideError!:string;
  emailVal:any;
  lang:any;
  currentUrl:string = '';
  showPassword:boolean = false;
  showPassword2:boolean = false;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

  constructor(private fb: FormBuilder,private router: Router,private activatedRoute:ActivatedRoute, private resetPass: RegistrationApiService){}

  ngOnInit(): void {
    this.snapshotUrl();
    this.emailVal = localStorage.getItem('email');
    this.resetPassForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6),Validators.pattern(this.passwordPattern)]],
    confirmNewPassword: ['', Validators.required],}, {
      validator: this.passwordMatchValidator
    });
  }

  
  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
      this.currentUrl = this.activatedRoute.snapshot.url.join('/').substring(3);
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }

    
  get newPassword(){return this.resetPassForm.get('newPassword')}
  get confirmNewPassword(){return this.resetPassForm.get('confirmNewPassword')}

  changeTypePass(){
    this.passwordType1 = (this.passwordType1 === 'password') ? 'text' : 'password';
  }

  changeTypeConfirmPass(){
    this.passwordType2 = (this.passwordType2 === 'password') ? 'text' : 'password';
  }

  passwordMatchValidator(group: FormGroup) {
    const passwordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmNewPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ mismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
    return true;
  }


  onSubmit(){
    this.resetPassBody = {
      email:this.emailVal,
      newPassword: this.resetPassForm.controls["newPassword"].value,
      confirmNewPassword: this.resetPassForm.controls["confirmNewPassword"].value,
    }

    if(this.resetPassForm.valid){
      this.resetPass.postResetPass(this.resetPassBody).subscribe((res:any)=>{
        if(res.statusCode == 200){
          this.router.navigate([`${this.lang}/login`])
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
    );}
     
    else if(this.resetPassForm.invalid){
      this.resetPassForm.markAllAsTouched();
      return;
    }
  }
}
