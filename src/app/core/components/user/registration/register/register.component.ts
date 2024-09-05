import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DataService } from '../../../../../shared/services/data.service';
import { ResponseApi, registrationResponse } from '../../../../../shared/interfaces/response-api';
import { Registration } from '../interfaces/registration';
import { RegistrationApiService } from '../registration-api.service';
import { RegistrationDataService } from '../../../../../shared/services/registration-data.service';
import { AccountinfoService } from '../../../../../shared/services/accountinfo.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule, RouterLink, CommonModule,CalendarModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registrationForm!: FormGroup;
  passwordType1: string = 'password';
  passwordType2: string = 'password';
  currentLanguage: any;
  showPassword:boolean = false;
  showPassword2:boolean = false;
  registrationSuccess :boolean = false;
  hijriMonthsAr = [
      { "id": '01', "value": "محرم" },
      { "id": '02', "value": "صفر" },
      { "id": '03', "value": "ربيع الأول" },
      { "id": '04', "value": "ربيع الثاني" },
      { "id": '05', "value": "جمادي الأول" },
      { "id": '06', "value": "جمادي الثاني" },
      { "id": '07', "value": "رجب" },
      { "id": '08', "value": "شعبان" },
      { "id": '09', "value": "رمضان" },
      { "id": '10', "value": "شوال" },
      { "id": '11', "value": "ذو القعدة" },
      { "id": '12', "value": "ذو الحجة" }

    ];
  hijriMonthsEn = [
      { "id": '01', "value": "Muharram" },
      { "id": '02', "value": "Safar" },
      { "id": '03', "value": "Rabi’ al-awal" },
      { "id": '04', "value": "Rabi’ al-thani" },
      { "id": '05', "value": "Jumada al-awal" },
      { "id": '06', "value": "Jumada al-thani" },
      { "id": '07', "value": "Rajab" },
      { "id": '08', "value": "Sha’aban" },
      { "id": '09', "value": "Ramadan" },
      { "id": '10', "value": "Shawwal" },
      { "id": '11', "value": "Duh al-Qidah" },
      { "id": '12', "value": "Duh al-Hijjah" }];

 meladiMonthsAr = [
    { "id": '01', "value": "يناير" },
  { "id": '02', "value": "فبراير" },
  { "id": '03', "value": "مارس" },
  { "id": '04', "value": "ابريل" },
  { "id": '05', "value": "مايو" },
  { "id": '06', "value": "يونيو" },
  { "id": '07', "value": "يوليو" },
  { "id": '08', "value": "اغسطس" },
  { "id": '09', "value": "سبتمبر" },
  { "id": '10', "value": "اكتوبر" },
  { "id": '11', "value": "نوفمبر" },
  { "id": '12', "value": "ديسيمبر" },

  ];
  meladiMonthsEn = [
    { "id": '01', "value": "Jan" },
    { "id": '02', "value": "Feb" },
    { "id": '03', "value": "Mar" },
    { "id": '04', "value": "Apr" },
    { "id": '05', "value": "May" },
    { "id": '06', "value": "Jun" },
    { "id": '07', "value": "Jul" },
    { "id": '08', "value": "Aug" },
    { "id": '09', "value": "Sep" },
    { "id": '10', "value": "Oct" },
    { "id": '11', "value": "Nov" },
    { "id": '12', "value": "Dec" }
  ];

  Days: number[] = [];
  years: any[] = [];
  meladiYears: any[] = [];
  nationalIdFirstChar:any;
  showHijriCalendar = true;
  showMeladiCalendar = false;
  vehicleValuePattern = /^[1-9]\d{3,}$/;
  currentYear: number = new Date().getFullYear();
  minYears: number = Math.round((this.currentYear - 622) * (33 / 32)) - 95;
  maxYears: number = Math.round((this.currentYear - 622) * (33 / 32)) - 2;
  minMeladiYears: number = Math.round((this.currentYear) * (33 / 32)) - 154;
  maxMeladiYears: number = Math.round((this.currentYear) * (33 / 32)) - 64;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   phonePattern = /^05\d{8}$/;
  registerBody!:Registration;
  dataError!:string; 
  serverSideError!:string;
  userId!:any;
  ownerIdFirstChar!:any;
  myCustomMonthDDL: any;
  myCustomYearDDL: any;
  birthday:string = '';
  lang:any;
  currentUrl:string = '';
  registerData:any;

  constructor(private activatedRoute:ActivatedRoute
    , private fb: FormBuilder, private router: Router,private dataService: DataService, 
    private register: RegistrationApiService, private accountService:AccountinfoService){}

  ngOnInit(): void {
    this.snapshotUrl();
    this.registrationForm = this.fb.group({
    ownerId: ['', Validators.required],
    driverMeladiMonth: [null, [Validators.required]],
    driverMeladiYear: [null, [Validators.required]],
    driverHijriMonth: [null, [Validators.required]],
    driverHijriYear: [null, [Validators.required]],
    email: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.required,Validators.pattern(this.phonePattern)]],
    password: ['', [Validators.required, Validators.minLength(6),Validators.pattern(this.passwordPattern)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validator: this.passwordMatchValidator
  });

    this.dataService.language$.subscribe({ next: (res) => {
      this.currentLanguage = res;
    }
  });

  this.generateYears(this.minYears, this.maxYears);
  this.generateMeladiYears(this.minMeladiYears, this.maxMeladiYears);
  
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

  generateMeladiYears(min:any, max:any) {
    for (let i = min; i <= max; i++) {
      this.meladiYears.push(i);
    }
    this.meladiYears.sort((a,b)=>(a>b? -1 : 1));
  }

  generateYears(min:any, max:any) {
    for (let i = min; i <= max; i++) {
      this.years.push(i);
    }
    this.years.sort((a,b)=>(a>b? -1 : 1));
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

  get ownerId(){return this.registrationForm.get('ownerId')}
  get driverMeladiMonth(){return this.registrationForm.get('driverMeladiMonth')}
  get driverMeladiYear(){return this.registrationForm.get('driverMeladiYear')}
  get driverHijriMonth(){return this.registrationForm.get('driverHijriMonth')}
  get driverHijriYear(){return this.registrationForm.get('driverHijriYear')}
  get email(){return this.registrationForm.get('email')}
  get name(){return this.registrationForm.get('name')}
  get phoneNumber(){return this.registrationForm.get('phoneNumber')}
  get password(){return this.registrationForm.get('password')}
  get confirmPassword(){return this.registrationForm.get('confirmPassword')}

  changeTypePass(){
    this.passwordType1 = (this.passwordType1 === 'password') ? 'text' : 'password';
  }
  

  changeTypeConfirmPass(){
    this.passwordType2 = (this.passwordType2 === 'password') ? 'text' : 'password';
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
 
    // English alphabets (A-Z, a-z), Arabic alphabets (أ-ي), and space
    const isAlphabetic = (charCode >= 65 && charCode <= 90) ||         // A-Z
                          (charCode >= 97 && charCode <= 122) ||      // a-z
                          (charCode >= 0x0621 && charCode <= 0x064A) || // Arabic alphabets (أ-ي)
                          charCode === 32;                             // space
 
    if (!isAlphabetic) {
      event.preventDefault();
    }
}

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

  detectChangeNo(e:any) {
    this.userId = this.registrationForm.controls["ownerId"].value;
    localStorage.setItem('ownerId', this.userId);
    this.ownerIdFirstChar = e.target['value'].charAt(0);
    if (this.ownerIdFirstChar == 1) {
      this.showHijriCalendar = true;
      this.showMeladiCalendar = false;
      this.registrationForm.controls["driverMeladiMonth"].setValue(null);
      this.registrationForm.controls["driverMeladiYear"].setValue(null);
      this.registrationForm.controls["driverMeladiMonth"].setValidators(null);
      this.registrationForm.controls["driverMeladiMonth"].updateValueAndValidity();
      this.registrationForm.controls["driverMeladiYear"].setValidators(null);
      this.registrationForm.controls["driverMeladiYear"].updateValueAndValidity();
    }
    else {
      this.showMeladiCalendar = true;
      this.showHijriCalendar = false;
      this.registrationForm.controls["driverHijriMonth"].setValue(null);
      this.registrationForm.controls["driverHijriYear"].setValue(null);
      this.registrationForm.controls["driverHijriMonth"].setValidators(null);
      this.registrationForm.controls["driverHijriMonth"].updateValueAndValidity();
      this.registrationForm.controls["driverHijriYear"].setValidators(null);
      this.registrationForm.controls["driverHijriYear"].updateValueAndValidity();
    }


  }

  login(){
    this.router.navigate([`${this.lang}/login`])
  }


  onSubmit(){
    if(this.registrationForm.valid){
     
      if (this.userId.charAt(0) == 1) {
        this.myCustomMonthDDL =  this.registrationForm.controls["driverHijriMonth"].value;
        this.myCustomYearDDL =  this.registrationForm.controls["driverHijriYear"].value;
        this.birthday = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
      }

      else{
        this.myCustomMonthDDL =  this.registrationForm.controls["driverMeladiMonth"].value;
        this.myCustomYearDDL =  this.registrationForm.controls["driverMeladiYear"].value;
        this.birthday = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
      }

      this.registerBody = {
        displayName: this.registrationForm.controls["name"].value,
        identityNumber: this.registrationForm.controls["ownerId"].value,
        birthOfDate:  this.birthday,
        email:this.registrationForm.controls["email"].value,
        phoneNumber: this.registrationForm.controls["phoneNumber"].value,
        password: this.registrationForm.controls["password"].value,
        confirmPassword: this.registrationForm.controls["confirmPassword"].value,
      }

      this.register.postRegister('user',this.registerBody).subscribe((res:any)=>{

        if(res.statusCode == 200){
          this.registerData = JSON.stringify(res.data)
           localStorage.setItem('registerData' , this.registerData);
          localStorage.setItem('isLoggedIn', 'true');
          this.registrationForm.reset();
          this.accountService.token = res.data.token;
         this.router.navigate([`${this.lang}/login-verify`]);
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

    else if(this.registrationForm.invalid){
      this.registrationForm.markAllAsTouched();
      return;
    }
  }
}

