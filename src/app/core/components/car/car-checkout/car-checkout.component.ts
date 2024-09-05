import { Registration } from './../../user/registration/interfaces/registration';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../../../shared/services/api.service';
import { CreditCardDirective } from '../../../directives/credit-card.directive';
import { ProgressBarComponent } from '../../../../shared/components/progress-bar/progress-bar.component';
import { CarInfoService } from '../../../services/car-info.service';
import { RegistrationDataService } from '../../../../shared/services/registration-data.service';
import { LoginVerifyComponent } from '../../user/registration/login-verify/login-verify.component';
import { ForgetPass } from '../../user/registration/interfaces/forget-pass';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
import { RegistrationApiService } from '../../user/registration/registration-api.service';
import { AccountinfoService } from '../../../../shared/services/accountinfo.service';
import { registrationResponse, ResponseApi } from '../../../../shared/interfaces/response-api';
declare var Moyasar: any;
declare var bootstrap: any;
@Component({
  selector: 'app-car-checkout',
  standalone: true,
  imports: [ NgxOtpInputComponent ,LoginVerifyComponent , ReactiveFormsModule,FormsModule, RouterLink, CommonModule, TranslateModule, CreditCardDirective,ProgressBarComponent],
  templateUrl: './car-checkout.component.html',
  styleUrl: './car-checkout.component.css'
})
export class CarCheckoutComponent implements OnInit{
  paymentForm!: FormGroup;
  otpForm!: FormGroup;
  createAccountForm!: FormGroup;
  minDate!: any;
  openOtpModal:boolean = false;
  cardNumberPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/;
  phonePattern = /^05\d{8}$/;
  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  lang:any;
  ratio:any;
  activeIndex: any;
  totalCost:number = 0;
  passwordType1: string = 'password';
  passwordType2: string = 'password';
  currentLanguage: any;
  showPassword:boolean = false;
  showPassword2:boolean = false;
  showPaymentCard:boolean = false;
  showOtp:boolean = false;
  serverSideError!:string;
  emailVal:any;
  isResendDisabled = true;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  currentUrl:string = '';
  identityNumber:any;
  otpCode: any;
  resendCodeBody!:ForgetPass;
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength: 6,
    autoFocus: true,
    autoBlur: true,
  };
  registerBody!:Registration;
  token:any;
  registerData:any;
  userData:any;
  vehicleInfo:any;
  registrationData:any;
  tabbyBody:any;
  webUrl:any;

  constructor(private register: RegistrationApiService, private accountService :AccountinfoService,
   private cdr: ChangeDetectorRef,private carInfo:CarInfoService,private activatedRoute:ActivatedRoute, 
   private fb: FormBuilder,private router:Router,private apiService:ApiService){
    this.minDate = new Date();
  }


  ngOnInit(): void {

    this.token = localStorage.getItem('token');
    this.carInfo.totalPrice.subscribe((res)=>{
      this.totalCost = res;
    })

    
    this.registerData = localStorage.getItem('registerData');
    if(this.registerData !==  "[object Object]"){
      this.userData = JSON.parse(this.registerData);
      this.registrationData = this.userData;
      console.log("registrationData", this.registrationData);
    }

    this.snapshotUrl();
    this.ratio = localStorage.getItem('medianRatio')

    // payment form
    this.paymentForm = this.fb.group({
      paymentGetWay:['visa', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern(this.cardNumberPattern)]],
      cvvNumber: ['', [Validators.required,Validators.minLength(3)]],
      mm: ['', [Validators.required,Validators.minLength(2)]],
      yy: ['', [Validators.required,Validators.minLength(2)]],
      nameCardHolders: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
    });

    // create account form
    this.createAccountForm = this.fb.group({
    email: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
    phoneNumber: ['', [Validators.required,Validators.pattern(this.phonePattern)]],
    password: ['', [Validators.required, Validators.minLength(6),Validators.pattern(this.passwordPattern)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validator: this.passwordMatchValidator
  });

   // otp form
   this.otpForm = this.fb.group({
    otp : [''],
   });
   this.startTimer();
  }

  get paymentGetWay(){return this.paymentForm.get('paymentGetWay')}
  get cardNumber(){return this.paymentForm.get('cardNumber')}
  get cvvNumber(){return this.paymentForm.get('cvvNumber')}
  get mm(){return this.paymentForm.get('mm')}
  get yy(){return this.paymentForm.get('yy')}
  get nameCardHolders(){return this.paymentForm.get('nameCardHolders')}
  get bankName(){return this.paymentForm.get('bankName')}


  get email(){return this.createAccountForm.get('email')}
  get phoneNumber(){return this.createAccountForm.get('phoneNumber')}
  get password(){return this.createAccountForm.get('password')}
  get confirmPassword(){return this.createAccountForm.get('confirmPassword')}

  // tappy payment
  tappyPayment(){
    this.tabbyBody ={
      "payment": {
        "amount":"100", 
        "currency": "SAR", 
        "description":"Payment",
        "buyer": {
            "phone": "500000001", 
            "email": "card.success@tabby.ai", 
            "name": "string", 
            "dob": "2019-08-24" 
        },
        "order": {
          "tax_amount": "0.00",
          "shipping_amount": "0.00",
          "discount_amount": "0.00",
          "updated_at": "2019-08-24T14:15:22Z",
          "reference_id": "string",
          "items": []
      }
      },
      "lang": "ar", 
      "merchant_code": "Pingsau"    
    }

    console.log("this.tabbyBody",this.tabbyBody)
    this.apiService.tappyPayment(this.tabbyBody).subscribe((res:any)=>{
      console.log(res);
    this.webUrl = res.web_url;
    });
  }

  // Moyasar payment
  choosePayment(index: number,paymentWay:string) {
    this.activeIndex = null;
    this.cdr.detectChanges();
    this.activeIndex = index;
    this.paymentGetWay?.setValue(paymentWay);
    this.clearMoyasarForm();
    const moyasarOptions = {
      element: '.mysr-form',
      amount: this.totalCost*100,
      currency: 'SAR',
      description: 'Coffee Order #1',
      publishable_api_key: 'pk_test_AQpxBV31a29qhkhUYFYUFjhwllaDVrxSq5ydVNui',
      callback_url: 'https://moyasar.com/thanks',
    };

    if (index === 1) {
      Moyasar.init({
        ...moyasarOptions,
        methods: ['creditcard'],
      });
    }

    else if (index === 2) {
      Moyasar.init({
        ...moyasarOptions,
        methods: ['stcpay'],
      });
    }

  }

  clearMoyasarForm() {
    const element = document.querySelector('.mysr-form');
    if (element) {
      element.innerHTML = ''; // Clear the form's content if needed

    }
    this.cdr.detectChanges();
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }

  passwordMatchValidator(group: FormGroup) {
    const passwordControl = group.get('password');
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

  ValidateNumber(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    const isNumber = charCode >= 48 && charCode <= 57;
    if (!isNumber) {
      event.preventDefault();
    }
  }

  ValidateAlphabetic(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    const isAlphabetic = (charCode >= 65 && charCode <= 90) || // A-Z
                        (charCode >= 97 && charCode <= 122) || // a-z
                        charCode === 32; // space

    if (!isAlphabetic) {
      event.preventDefault();
    }
  }

  previousPage() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate([`${this.lang}/car-quotation`]);
 }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
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

  openModal() {
    const modalElement = document.getElementById('otp');
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement);
      myModal.show();
    }
  }
  
  
  resendCode(){
    
    this.startTimer();
    this.resendCodeBody = {
      email: this.emailVal,
    }
  
    this.register.postResendOtp(this.resendCodeBody).subscribe((res:any)=>{
        
        if(res.statusCode == 200){
         console.log("success");
        
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

  createAccount(){
    
    console.log(this.userData)
    if(this.userData != null){
      this.openModal();
    }
    else{
   
      if(this.createAccountForm.valid){
        this.registerBody = {
          displayName: this.vehicleInfo.displayName,
          identityNumber: this.vehicleInfo.userIdentity,
          birthOfDate:  this.vehicleInfo.birthDate,
          email:this.createAccountForm.controls["email"].value,
          phoneNumber: this.createAccountForm.controls["phoneNumber"].value,
          password: this.createAccountForm.controls["password"].value,
          confirmPassword: this.createAccountForm.controls["confirmPassword"].value,
        }
  
        this.register.postRegister('user',this.registerBody).subscribe((res:any)=>{
          if(res.statusCode == 200){
            this.registerData = JSON.stringify(res.data)
            localStorage.setItem('registerData' , this.registerData);
            localStorage.setItem('isLoggedIn', 'true');
            this.createAccountForm.reset();
            this.openModal();
          }
          else if(res.statusCode == 204){
            //empty data
            this.serverSideError = res.message;
          }
          else if(res.statusCode == 400){
            //data error
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
    
      else{
        this.createAccountForm.markAllAsTouched();
        return;
      }
    }
  }

  confirmOtp(){
    if(this.otpCode.length > 5){
      this.register.postLogin2AF(this.otpCode, this.vehicleInfo.userIdentity).subscribe((res:ResponseApi<registrationResponse>)=>{
        if(res.statusCode == 200){
          this.accountService.token = res.data.token;
          this.choosePayment(1, 'creditcard');
          this.showPaymentCard = true;
        }
        else if(res.statusCode == 204){
          this.serverSideError = res.message;
        }
        else if(res.statusCode == 400){
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
    
      else{
        // this.otpForm.markAllAsTouched();
        return;
      }
  
  }

  onSubmit(){
    if(this.paymentForm.invalid){
      this.paymentForm.markAllAsTouched();
      return;
    }

    else{
       this.router.navigate([`${this.lang}/payment-done`])
    }
  }


}
