import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Login } from '../interfaces/login';
import { ForgetPass } from '../interfaces/forget-pass';

import { ResponseApi, registrationResponse } from '../../../../../shared/interfaces/response-api';
import { RegistrationApiService } from '../registration-api.service';
import { AccountinfoService } from '../../../../../shared/services/accountinfo.service';
import { RegistrationDataService } from '../../../../../shared/services/registration-data.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule, RouterLink, CommonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

 loginForm!: FormGroup;
 passwordType: string = 'password';
 passwordPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
 emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 loginBody!:Login;
 forgetPassBody!:ForgetPass;
 emptyData!:string
 dataError!:string
 serverSideError!:string
 showPassword:boolean = false;
 lang:any;
 currentUrl:string = '';
 registerData:any;

  constructor(private fb: FormBuilder,private activatedRoute:ActivatedRoute,private router: Router, private login: RegistrationApiService,private accountService:AccountinfoService){}

  ngOnInit(): void {
    this.snapshotUrl();
    this.loginForm = this.fb.group({
    identityNumber: [null, [Validators.required, Validators.minLength(10)]],
    password: ['', Validators.required],
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

  get identityNumber(){return this.loginForm.get('identityNumber');}
  get password(){return this.loginForm.get('password')}



  allowSudiaID(e:any) {
    let input;
    // Allow metaKey or ctrlKey combinations
    if (e.metaKey || e.ctrlKey) {
      return true;
    }

    // Allow special keys
    if (e.which === 0 || e.which < 33) {
      return true;
    }

    // Get the input character
    input = String.fromCharCode(e.which);

    // Check for valid digits
    if (!/[0-9]/.test(input)) { // Allow any digit, not just 1 and 2
      e.preventDefault();
      return false;
    }

    const currentValue = e.target.value; // Get the current value in the input field
    // Check if the first character is being entered
    if (currentValue.length === 0) {
      // If the first character, allow only 1 or 2
      if (!/[1-2]/.test(input)) {
        e.preventDefault();
        return false;
      }
    }
    return true;

  }

  onSubmit(){
    this.loginBody = {
      identityNumber: this.loginForm.controls["identityNumber"].value,
      password: this.loginForm.controls["password"].value,
    }

    if(this.loginForm.valid){
      this.login.postLogin(this.loginBody).subscribe((res:any)=>{
        if(res.statusCode == 200){
          this.registerData = JSON.stringify(res.data)
          localStorage.setItem('registerData' , this.registerData);
         localStorage.setItem('isLoggedIn', 'true');
          this.accountService.token = res.data.token;
         this.router.navigate([`${this.lang}/login-verify`]);
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

    else if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
  }

}
