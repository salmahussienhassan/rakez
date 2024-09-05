import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, TranslateModule],
  templateUrl: './change-password-profile.component.html',
  styleUrl: './change-password-profile.component.css'
})
export class ChangePasswordProfileComponent  implements OnInit{
  changePasswordForm!:FormGroup;
  lang:any;
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    this.snapshotUrl();
    this.changePasswordForm = this.fb.group({
    oldPassword:['', Validators.required],
    newPassword:['', Validators.required],
    confirmPassword:['', Validators.required]
  }, {
    validator: this.passwordMatchValidator
  });
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }

  passwordMatchValidator(group: FormGroup) {
    const passwordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmPassword');

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

  get oldPassword(){return this.changePasswordForm.get('oldPassword')}
  get newPassword(){return this.changePasswordForm.get('newPassword')}
  get confirmPassword(){return this.changePasswordForm.get('confirmPassword')}

  onSubmit(){
    if(this.changePasswordForm.invalid){
      this.changePasswordForm.markAllAsTouched();
      return;
    }
  } 


}
