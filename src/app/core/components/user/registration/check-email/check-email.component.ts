import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RegistrationApiService } from '../registration-api.service';
import { ForgetPass } from '../interfaces/forget-pass';

@Component({
  selector: 'app-check-email',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink, CommonModule, TranslateModule],
  templateUrl: './check-email.component.html',
  styleUrl: './check-email.component.css'
})
export class CheckEmailComponent implements OnInit {
  checkEmailForm!: FormGroup;
  emailBody!:ForgetPass;
  serverSideError!:string;
  token!:any;
  lang:any;
  currentUrl:string = '';
  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private fb: FormBuilder, private router: Router,private activatedRoute:ActivatedRoute, private checkEmail: RegistrationApiService) { }
  ngOnInit(): void {
    this.snapshotUrl();
    this.checkEmailForm = this.fb.group({
      email:['', [Validators.required, Validators.pattern(this.emailPattern)]]
      })
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

  register(){
    this.router.navigate([`${this.lang}/register`])
  }

  get email(){return this.checkEmailForm.get('email')}

  onSubmit(){
    if(this.checkEmailForm.valid){
      this.emailBody ={
        email:this.checkEmailForm.controls["email"].value
      }
      localStorage.setItem('email', this.checkEmailForm.controls["email"].value);
      
      this.checkEmail.postForgetPost(this.emailBody).subscribe((res:any)=>{
          if(res.statusCode == 200){
            this.router.navigate([`${this.lang}/otp`])
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

    else if(this.checkEmailForm.invalid){
      this.checkEmailForm.markAllAsTouched();
      return;
    } 
  }

}
