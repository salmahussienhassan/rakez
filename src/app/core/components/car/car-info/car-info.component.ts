import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CarInfo } from '../../../interfaces/car-info';
import { CarInfoService } from '../../../services/car-info.service';
import { LangService } from '../../../../shared/services/lang.service';
import { ApiService } from '../../../../shared/services/api.service';
import { verifyCode } from '../../../../shared/interfaces/response-api';
import { CalendarModule } from 'primeng/calendar';
import { HomeActiveFormService } from '../../../../shared/services/home-active-form.service';
import { DataService } from '../../../../shared/services/data.service';
import { RegistrationDataService } from '../../../../shared/services/registration-data.service';
import { SearchDatePipe } from '../../../pipes/search-date.pipe';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-car-info',
  standalone: true,
  imports: [NgSelectModule,SearchDatePipe, ReactiveFormsModule,FormsModule, RouterLink, CommonModule, HttpClientModule, TranslateModule, 
    CalendarModule],
  templateUrl: './car-info.component.html',
  styleUrl: './car-info.component.css'
})
export class CarInfoComponent {
  newInsuranceForm!: FormGroup;
  transferOwnershipForm!: FormGroup;
  customsCardForm!: FormGroup;
  newInsurance: boolean = true;
  transferOwnership: boolean = false;
  customsCard: boolean = false;
  submitted: boolean = false;
  viability:boolean = false;
  emptyData!:string
  dataError!:string 
  serverSideError!:string
  ownerIdPrefilled:any;
  policyStartDatePrefilled: any;
  activeIndex: number = 1;
  minDate!: any;
  maxDate!: any;
  todayDate!: any;
  checkbox1:any;
  checkbox2:any;
  checkbox3:any;
  ownerId:any;
  newOwnerId:any;
  code!:any;
  imgurl!:any;
  baseUrl!: string;
  manufactureYear: any[] = [];
  currentYear: number = new Date().getFullYear();
  minManufactureYears: number = (this.currentYear - 12);
  maxManufactureYears: number = this.currentYear;
  currentLanguage: any;
  Days: number[] = [];
  years: any[] = [];
  meladiYears: any[] = [];
  birthday: any;
  userLoggedIn:any;
  ownerIdFirstChar:any;
  newOwnerIdFirstChar:any;
  showHijriCalendar = true;
  showMeladiCalendar = false;
  minYears: number = Math.round((this.currentYear - 622) * (33 / 32)) - 101;
  maxYears: number = Math.round((this.currentYear - 622) * (33 / 32)) - 20; 
  minMeladiYears: number = Math.round((this.currentYear) * (33 / 32)) - 163;
  maxMeladiYears: number = Math.round((this.currentYear) * (33 / 32)) - 80;
  hijriMonthsAr: any =[];
  hijriMonthsEn: any =[];
  meladiMonthsAr: any =[];
  meladiMonthsEn: any = [];
  myCustomMonthDDL: any;
  myCustomYearDDL: any;
  insuranceStartDate:any;
  newInsuranceObj!:CarInfo;
  transferOwnershipObj!:CarInfo;
  customsCardObj!:CarInfo;
  lang:any;
  @Input() homeIsActive: boolean = false;
  @Input() formIndex: number = 1;
  vehicleInfo:any;
  registrationData:any ={};
  isChecked1=false;
  isChecked2=false;
  isChecked3=false;
  registerData:any;
  userData:any;
  constructor(private fb: FormBuilder, private router: Router,  private langService: LangService,
  private verificationCode :ApiService,  private carInfoService: CarInfoService,private dataService:DataService,
  private activatedRoute:ActivatedRoute,
  private homeActiveFormService: HomeActiveFormService,
  private cdr: ChangeDetectorRef){}


  ngOnInit(): void {

    this.newInsuranceForm = this.fb.group({  
      ownerId: [null,[Validators.required, Validators.minLength(10)]],
      driverHijriMonth: [null, [Validators.required]],
      driverHijriYear: [null, [Validators.required]],
      driverMeladiMonth: [null, [Validators.required]],
      driverMeladiYear: [null, [Validators.required]],
      serialNumber1: [null, [Validators.required, Validators.minLength(8)]],
      policyStartDate1: [null, Validators.required],
      captcha1: [null, [Validators.required, this.codeMatchedValidator]]},
      { validator: this.codeMatchedValidator}
    );

    this.transferOwnershipForm = this.fb.group({
      ownerId2: [null,[Validators.required, Validators.minLength(10)]],
      newOwnerId: [null,[Validators.required, Validators.minLength(10), this.identityMatchValidator]],
      driverHijriMonthBuyer: [null, [Validators.required]],
      driverHijriYearBuyer: [null, [Validators.required]],
      driverMeladiMonthBuyer: [null, [Validators.required]],
      driverMeladiYearBuyer: [null, [Validators.required]],
      serialNumber2: [null, [Validators.required, Validators.minLength(8)]],
      policyStartDate2: [null, Validators.required],
      captcha2: [null, [Validators.required, this.codeMatchedValidator]]},
      { validator: [this.identityMatchValidator, this.codeMatchedValidator]}
    );
     
    this.customsCardForm = this.fb.group({
      ownerId3: [null,[Validators.required, Validators.minLength(10)]],
      driverHijriMonth2: [null, [Validators.required]],
      driverHijriYear2: [null, [Validators.required]],
      driverMeladiMonth2: [null, [Validators.required]],
      driverMeladiYear2: [null, [Validators.required]],
      manufactureYear: [null, [Validators.required]],
      customsCard: [null,[Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      policyStartDate3: [null, Validators.required],
      captcha3: [null, [Validators.required, this.codeMatchedValidator]]},
      { validator: this.codeMatchedValidator}
    );

    this.userLoggedIn = localStorage.getItem('isLoggedIn') ;
    console.log("auth", this.userLoggedIn);
    
    this.langService.language$.subscribe({ next: (res) => {
      this.currentLanguage = res;
    }
    });
    this.homeActiveFormService.formIndex$.subscribe((index) => {
      this.activeIndex = index;
      this.isActive(this.activeIndex);
      this.cdr.detectChanges();
    });


    this.registerData = localStorage.getItem('registerData');
    if(this.registerData !==  "[object Object]"){
      this.userData = JSON.parse(this.registerData);
      this.registrationData = this.userData;
      console.log("registrationData", this.registrationData);
    }

    this.hijriMonthsAr = [
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

    this.hijriMonthsEn = [
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
  
    this.meladiMonthsAr = [
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
    this.meladiMonthsEn = [
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

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate = new Date();
    this.generateManufactureYears(this.minManufactureYears, this.maxManufactureYears);
    this.generateYears(this.minYears, this.maxYears);
    this.generateMeladiYears(this.minMeladiYears, this.maxMeladiYears);
    this.getCaptchaIMG();
    localStorage.setItem('insuranceType', this.activeIndex.toString());
  }


  isDisabled = false;

  // Method to handle the change event
  onChange(event: any): void {
    // Handle the change event
  }

  selectType(type:number){
    if(type === 1){
      this.newInsurance = true;
      this.transferOwnership = false;
      this.customsCard = false;
    }

    if(type === 2){
      this.transferOwnership = true;
      this.newInsurance = false;
      this.customsCard = false;
    }
     
    if(type === 3){
      this.customsCard = true;
      this.newInsurance = false;
      this.transferOwnership = false;
    }
    
    this.activeIndex = type;
    // console.log(this.activeIndex);
    this.isActive(this.activeIndex)
    localStorage.setItem('insuranceType', this.activeIndex.toString());
  }

  onCheckboxChange(event: Event,index:number) {
    const target = event.target as HTMLInputElement;
    if(index==1)
    this.isChecked1 = target.checked;
  else if(index==2)
    this.isChecked2 = target.checked;
  else
  this.isChecked3 = target.checked;
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  getCaptchaIMG(){
    this.baseUrl = 'https://rakizinsurance.runasp.net/'
    this.verificationCode.getVerificationCode().subscribe((data:verifyCode)=>{
      this.imgurl = data.imageUrl;
      this.newInsuranceForm.get('captcha1')?.setValidators(this.codeMatchedValidator(data.code));
      this.transferOwnershipForm.get('captcha2')?.setValidators(this.codeMatchedValidator(data.code));
      this.customsCardForm.get('captcha3')?.setValidators(this.codeMatchedValidator(data.code));
      
     console.log(data);
    });
  }
  generateManufactureYears(min: number, max: number) {
    this.manufactureYear = []; // Reinitialize the array
    for (let i = min; i <= max; i++) {
      this.manufactureYear.push({ id: i, value: i });
    }
    this.manufactureYear.sort((a, b) => (a.value > b.value ? -1 : 1)); // Sort by value in descending order
  }
  
 
  identityMatchValidator(control: AbstractControl): ValidationErrors | null {
    const ownerId2 = control.get('ownerId2');
    const newOwnerId = control.get('newOwnerId');
  
    if (ownerId2?.dirty && ownerId2.value !== null) {
      if(newOwnerId?.value ===null)
        {
          newOwnerId?.setValidators([Validators.required]);
        }
      else if(newOwnerId?.value.length<10)
        {
          newOwnerId?.setValidators([Validators.required,Validators.minLength(10)]);
        }
      else if (ownerId2.value === newOwnerId?.value) {
        newOwnerId?.setErrors({ identityNotMatched: true });
      } 
      else {
        newOwnerId?.setErrors(null);
      }
    }
  
    return null;
  }

  codeMatchedValidator(apiCode: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const enteredCode = control.value;
     
      if (enteredCode === null || enteredCode === '') {
        console.log('1');
        return null;
      }
    
      else if (enteredCode != apiCode) {
        this.captcha1Validation?.setErrors({ codeMatched: true });
        return { codeMatched: true };
      }
      else{
        this.captcha1Validation?.setErrors(null);
        return null;
      }
    };
  }

  allowOnlyNumbers(e:any) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }

    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }

    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
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

  // Form validation
  get ownerIdValidation() {return this.newInsuranceForm.get('ownerId');}
  get driverHijriMonth() { return this.newInsuranceForm.get("driverHijriMonth"); }
  get driverHijriYear() { return this.newInsuranceForm.get("driverHijriYear"); }
  get driverMeladiMonth() { return this.newInsuranceForm.get("driverMeladiMonth"); }
  get driverMeladiYear() { return this.newInsuranceForm.get("driverMeladiYear"); }
  get serialNumber1Validation() {return this.newInsuranceForm.get('serialNumber1');}
  get policyStartDateValidation1() {return this.newInsuranceForm.get('policyStartDate1');}
  get captcha1Validation(){return this.newInsuranceForm.get('captcha1');}

  get ownerId2Validation() {return this.transferOwnershipForm.get('ownerId2');}
  get newOwnerIdValidation() {return this.transferOwnershipForm.get('newOwnerId');}
  get driverHijriMonthBuyer() { return this.transferOwnershipForm.get("driverHijriMonthBuyer"); }
  get driverHijriYearBuyer() { return this.transferOwnershipForm.get("driverHijriYearBuyer"); }
  get driverMeladiMonthBuyer() { return this.transferOwnershipForm.get("driverMeladiMonthBuyer"); }
  get driverMeladiYearBuyer() { return this.transferOwnershipForm.get("driverMeladiYearBuyer"); }
  get serialNumber2Validation() {return this.transferOwnershipForm.get('serialNumber2');}
  get policyStartDateValidation2() {return this.transferOwnershipForm.get('policyStartDate2');}
  get captcha2Validation(){return this.transferOwnershipForm.get('captcha2');}
 
  
  get customsCardValidation() {return this.customsCardForm.get('customsCard');}
  get ownerId3Validation() {return this.customsCardForm.get('ownerId3');}
  get driverHijriMonth2() { return this.customsCardForm.get("driverHijriMonth2"); }
  get driverHijriYear2() { return this.customsCardForm.get("driverHijriYear2"); }
  get driverMeladiMonth2() { return this.customsCardForm.get("driverMeladiMonth2"); }
  get driverMeladiYear2() { return this.customsCardForm.get("driverMeladiYear2"); }
  get policyStartDateValidation3() {return this.customsCardForm.get('policyStartDate3');}
  get manufactureYearValidation() {return this.customsCardForm.get('manufactureYear');}
  get captcha3Validation(){return this.customsCardForm.get('captcha3');}

  newInsuranceOwnerIdVal(e:any){
    this.ownerId = this.newInsuranceForm.controls["ownerId"].value;
      this.ownerIdFirstChar = e.target['value'].charAt(0);
      if (this.ownerIdFirstChar == 1) {
        this.showHijriCalendar = true;
        this.showMeladiCalendar = false;
        this.newInsuranceForm.controls["driverMeladiMonth"].setValue(null);
        this.newInsuranceForm.controls["driverMeladiYear"].setValue(null);
        this.newInsuranceForm.controls["driverMeladiMonth"].setValidators(null);
        this.newInsuranceForm.controls["driverMeladiMonth"].updateValueAndValidity();
        this.newInsuranceForm.controls["driverMeladiYear"].setValidators(null);
        this.newInsuranceForm.controls["driverMeladiYear"].updateValueAndValidity();
      }
      else {
        this.showMeladiCalendar = true;
        this.showHijriCalendar = false;
        this.newInsuranceForm.controls["driverHijriMonth"].setValue(null);
        this.newInsuranceForm.controls["driverHijriYear"].setValue(null);
        this.newInsuranceForm.controls["driverHijriMonth"].setValidators(null);
        this.newInsuranceForm.controls["driverHijriMonth"].updateValueAndValidity();
        this.newInsuranceForm.controls["driverHijriYear"].setValidators(null);
        this.newInsuranceForm.controls["driverHijriYear"].updateValueAndValidity();
      }
  }

  newOwnerIdVal(e:any){
    this.newOwnerId = this.transferOwnershipForm.controls["newOwnerId"].value;
    this.newOwnerIdFirstChar = e.target['value'].charAt(0);
    if (this.newOwnerIdFirstChar == 1) {
      this.showHijriCalendar = true;
      this.showMeladiCalendar = false;
      this.transferOwnershipForm.controls["driverMeladiMonthBuyer"].setValue(null);
      this.transferOwnershipForm.controls["driverMeladiYearBuyer"].setValue(null);
      this.transferOwnershipForm.controls["driverMeladiMonthBuyer"].setValidators(null);
      this.transferOwnershipForm.controls["driverMeladiMonthBuyer"].updateValueAndValidity();
      this.transferOwnershipForm.controls["driverMeladiYearBuyer"].setValidators(null);
      this.transferOwnershipForm.controls["driverMeladiYearBuyer"].updateValueAndValidity();
    }
    else {
      this.showMeladiCalendar = true;
      this.showHijriCalendar = false;
      this.transferOwnershipForm.controls["driverHijriMonthBuyer"].setValue(null);
      this.transferOwnershipForm.controls["driverHijriYearBuyer"].setValue(null);
      this.transferOwnershipForm.controls["driverHijriMonthBuyer"].setValidators(null);
      this.transferOwnershipForm.controls["driverHijriMonthBuyer"].updateValueAndValidity();
      this.transferOwnershipForm.controls["driverHijriYearBuyer"].setValidators(null);
      this.transferOwnershipForm.controls["driverHijriYearBuyer"].updateValueAndValidity();
    }
  
  }

  customsCardOwnerIdVal(e:any){
    this.ownerId = this.customsCardForm.controls["ownerId3"].value;
    localStorage.setItem('ownerId', this.ownerId);
    this.ownerIdFirstChar = e.target['value'].charAt(0);
    if (this.ownerIdFirstChar == 1) {
      this.showHijriCalendar = true;
      this.showMeladiCalendar = false;
      this.customsCardForm.controls["driverMeladiMonth2"].setValue(null);
      this.customsCardForm.controls["driverMeladiYear2"].setValue(null);
      this.customsCardForm.controls["driverMeladiMonth2"].setValidators(null);
      this.customsCardForm.controls["driverMeladiMonth2"].updateValueAndValidity();
      this.customsCardForm.controls["driverMeladiYear2"].setValidators(null);
      this.customsCardForm.controls["driverMeladiYear2"].updateValueAndValidity();
    }
    else {
      this.showMeladiCalendar = true;
      this.showHijriCalendar = false;
      this.customsCardForm.controls["driverHijriMonth2"].setValue(null);
      this.customsCardForm.controls["driverHijriYear2"].setValue(null);
      this.customsCardForm.controls["driverHijriMonth2"].setValidators(null);
      this.customsCardForm.controls["driverHijriMonth2"].updateValueAndValidity();
      this.customsCardForm.controls["driverHijriYear2"].setValidators(null);
      this.customsCardForm.controls["driverHijriYear2"].updateValueAndValidity();
    }
  }

  // generateMeladiYears(min:any, max:any) {
  //   for (let i = min; i <= max; i++) {
  //     this.meladiYears.push(i);
  //   }
  //   this.meladiYears.sort((a,b)=>(a>b? -1 : 1));
  // }

  generateMeladiYears(min: number, max: number) {
    this.meladiYears = []; // Reinitialize the array
    for (let i = min; i <= max; i++) {
      this.meladiYears.push({ id: i, value: i });
    }
    this.meladiYears.sort((a, b) => (a.value > b.value ? -1 : 1)); // Sort by value in descending order
  }
  

  // generateYears(min:any, max:any) {
  //   for (let i = min; i <= max; i++) {
  //     this.years.push(i);
  //     console.log(this.years)
  //   }
  //   this.years.sort((a,b)=>(a>b? -1 : 1));
  // }

  generateYears(min: number, max: number) {
    this.years = []; // Reinitialize the array
    for (let i = min; i <= max; i++) {
      this.years.push({ id: i, value: i });
    }
    this.years.sort((a, b) => (a.value > b.value ? -1 : 1)); // Sort by value in descending order
  }

  policyStartDate1(){
   const originalDate = this.newInsuranceForm.controls["policyStartDate1"].value;
   this.convertDate(originalDate)
  }

  policyStartDate2(){
    const originalDate = this.transferOwnershipForm.controls["policyStartDate2"].value;
    this.convertDate(originalDate)
   }

   policyStartDate3(){
    const originalDate = this.customsCardForm.controls["policyStartDate3"].value;
    this.convertDate(originalDate)
   }

  convertDate(selectedDate:any){
    const date =  new Date(selectedDate);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const desiredFormat = "DD-MM-YYYY";
    this.insuranceStartDate = formattedDate.replace(
     /(\d{2})\/(\d{2})\/(\d{4})/,
     `${desiredFormat.slice(3, 2)}$2-$1-$3`);
  }

  submitNewInsurance(data:any){
    this.submitted = true;  
    if(this.userLoggedIn == 'false'){
      if (this.ownerId.charAt(0) == 1) {
        this.myCustomMonthDDL =  this.newInsuranceForm.controls["driverHijriMonth"].value;
        this.myCustomYearDDL =  this.newInsuranceForm.controls["driverHijriYear"].value;
        this.birthday = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
      }

      else{
        this.myCustomMonthDDL =  this.newInsuranceForm.controls["driverMeladiMonth"].value;
        this.myCustomYearDDL =  this.newInsuranceForm.controls["driverMeladiYear"].value;
        this.birthday = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
      }

      this.newInsuranceObj = {
        userIdentity : this.ownerId,
        insuranceStartDate: this.insuranceStartDate,
        serialNumber: this.newInsuranceForm.controls["serialNumber1"].value,
        birthDate:this.birthday
      }
    }

    else{
      this.newInsuranceForm.controls["driverMeladiMonth"].setValidators(null);
      this.newInsuranceForm.controls["driverMeladiMonth"].updateValueAndValidity();
      this.newInsuranceForm.controls["driverMeladiYear"].setValidators(null);
      this.newInsuranceForm.controls["driverMeladiYear"].updateValueAndValidity();
      this.newInsuranceForm.controls["driverHijriMonth"].setValidators(null);
      this.newInsuranceForm.controls["driverHijriMonth"].updateValueAndValidity();
      this.newInsuranceForm.controls["driverHijriYear"].setValidators(null);
      this.newInsuranceForm.controls["driverHijriYear"].updateValueAndValidity();
      this.newInsuranceForm.controls["ownerId"].setValidators(null);
      this.newInsuranceForm.controls["ownerId"].updateValueAndValidity();

      this.newInsuranceObj = {
        userIdentity :this.registrationData.identityNumber,
        insuranceStartDate: this.insuranceStartDate,
        serialNumber: this.newInsuranceForm.controls["serialNumber1"].value,
        birthDate:this.registrationData.birthdate
      }
    }
  
    if(this.newInsuranceForm.valid){
      this.carInfoService.addNewInsurance(this.newInsuranceObj).subscribe((res:any)=>{
        if(res.statusCode == 200){
          this.vehicleInfo = JSON.stringify(res.data);
          localStorage.setItem('vehicleInfo',  this.vehicleInfo)
          this.langService.setActiveIcon('car-details');
          if( res.data == null){
            this.serverSideError = "الرجاء التأكد من البيانات المدخلة"
          }
          else{
            this.activatedRoute.paramMap.subscribe(params => {
              this.lang = params.get('lang');
              this.router.navigate([`${this.lang}/car-details`])
            })
          }
        }
        else if(res.statusCode == 204){
          this.serverSideError = data.message;
        }

        else if(res.statusCode == 400){
          this.serverSideError = data.message;
        }

        else{
          this.serverSideError = data.message;
        }
      },
      err => {
        this.serverSideError = "Not Found";
      }
     );
    }

    else if(this.newInsuranceForm.invalid){
      this.newInsuranceForm.markAllAsTouched();
      console.log("form not valid", this.newInsuranceForm.value);
      return;
    }
  }

  submitTransferOwnership(data:any){
    this.submitted = true;
    if(this.userLoggedIn == 'false'){
      if (this.newOwnerId.charAt(0) == 1) {
        this.myCustomMonthDDL =  this.transferOwnershipForm.controls["driverHijriMonthBuyer"].value;
        this.myCustomYearDDL =  this.transferOwnershipForm.controls["driverHijriYearBuyer"].value;
        this.birthday = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
      }
  
      else{
        this.myCustomMonthDDL =  this.transferOwnershipForm.controls["driverMeladiMonthBuyer"].value;
        this.myCustomYearDDL =  this.transferOwnershipForm.controls["driverMeladiYearBuyer"].value;
        this.birthday = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
      }

      this.transferOwnershipObj = {
        userIdentity :this.transferOwnershipForm.controls["ownerId2"].value,
        insuranceStartDate: this.insuranceStartDate,
        newOwnerIdentity:this.newOwnerId,
        serialNumber: this.transferOwnershipForm.controls["serialNumber2"].value,
        birthDate:this.birthday,
      }
    }

    else{
      this.transferOwnershipForm.controls["driverHijriMonthBuyer"].setValidators(null);
      this.transferOwnershipForm.controls["driverHijriMonthBuyer"].updateValueAndValidity();
      this.transferOwnershipForm.controls["driverHijriYearBuyer"].setValidators(null);
      this.transferOwnershipForm.controls["driverHijriYearBuyer"].updateValueAndValidity();
      this.transferOwnershipForm.controls["driverMeladiMonthBuyer"].setValidators(null);
      this.transferOwnershipForm.controls["driverMeladiMonthBuyer"].updateValueAndValidity();
      this.transferOwnershipForm.controls["driverMeladiYearBuyer"].setValidators(null);
      this.transferOwnershipForm.controls["driverMeladiYearBuyer"].updateValueAndValidity();
      this.transferOwnershipForm.controls["newOwnerId"].setValidators(null);
      this.transferOwnershipForm.controls["newOwnerId"].updateValueAndValidity();

      this.transferOwnershipObj = {
        userIdentity :this.registrationData.identityNumber,
        insuranceStartDate: this.insuranceStartDate,
        newOwnerIdentity:this.newOwnerId,
        serialNumber: this.transferOwnershipForm.controls["serialNumber2"].value,
        birthDate:this.registrationData.birthdate
      }
    }

    if(this.transferOwnershipForm.valid){
      this.carInfoService.addTransferOwnership(this.transferOwnershipObj).subscribe((res:any)=>{
        if(res.statusCode == 200){
          this.vehicleInfo = JSON.stringify(res.data);
          localStorage.setItem('vehicleInfo',  this.vehicleInfo)
          this.langService.setActiveIcon('car-details');
          if( res.data == null){
            this.serverSideError = "الرجاء التأكد من البيانات المدخلة"
          }
          else{
            this.activatedRoute.paramMap.subscribe(params => {
              this.lang = params.get('lang');
              this.router.navigate([`${this.lang}/car-details`])
            })
          }
        }
        else if(res.statusCode == 204){
          this.serverSideError = data.message;
        }
        else if(res.statusCode == 400){
          this.serverSideError = data.message;
        }
        else{
          this.serverSideError = data.message;
        }
      },
      err => {
        this.serverSideError = "Not Found";
      }
      );
    }

    else if(this.transferOwnershipForm.invalid){
      this.transferOwnershipForm.markAllAsTouched();
      return;
    }
  }

  submitCustomsCard(data:any){
    this.submitted = true;
    if(this.userLoggedIn == 'false'){
      if (this.ownerId.charAt(0) == 1) {
        this.myCustomMonthDDL =  this.customsCardForm.controls["driverHijriMonth2"].value;
        this.myCustomYearDDL =  this.customsCardForm.controls["driverHijriYear2"].value;
        this.birthday = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
      }

      else{
        this.myCustomMonthDDL =  this.customsCardForm.controls["driverMeladiMonth2"].value;
        this.myCustomYearDDL =  this.customsCardForm.controls["driverMeladiYear2"].value;
        this.birthday = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
      }

      this.customsCardObj = {
        userIdentity :this.customsCardForm.controls["ownerId3"].value,
        insuranceStartDate: this.insuranceStartDate,
        manufactureYear: this.customsCardForm.controls["manufactureYear"].value,
        customsCardNumber: this.customsCardForm.controls["customsCard"].value,
        birthDate:this.birthday,
      }

    }

    else{
      this.customsCardForm.controls["driverHijriMonth2"].setValidators(null);
      this.customsCardForm.controls["driverHijriMonth2"].updateValueAndValidity();
      this.customsCardForm.controls["driverHijriYear2"].setValidators(null);
      this.customsCardForm.controls["driverHijriYear2"].updateValueAndValidity();
      this.customsCardForm.controls["driverMeladiMonth2"].setValidators(null);
      this.customsCardForm.controls["driverMeladiMonth2"].updateValueAndValidity();
      this.customsCardForm.controls["driverMeladiYear2"].setValidators(null);
      this.customsCardForm.controls["driverMeladiYear2"].updateValueAndValidity();
      this.customsCardForm.controls["ownerId3"].setValidators(null);
      this.customsCardForm.controls["ownerId3"].updateValueAndValidity();

      this.customsCardObj = {
        userIdentity :this.registrationData.identityNumber,
        insuranceStartDate: this.insuranceStartDate,
        manufactureYear: this.customsCardForm.controls["manufactureYear"].value,
        customsCardNumber: this.customsCardForm.controls["customsCard"].value,
        birthDate:this.registrationData.birthdate
      }

    }
    
    if(this.customsCardForm.valid){

      this.carInfoService.addCustomCard(this.customsCardObj).subscribe((res:any)=>{
        if(res.statusCode == 200){
          this.vehicleInfo = JSON.stringify(res.data);
          localStorage.setItem('vehicleInfo',  this.vehicleInfo)
          this.langService.setActiveIcon('car-details');
          
          if( res.data == null){
            this.serverSideError = "الرجاء التأكد من البيانات المدخلة"
          }
          else{
            this.activatedRoute.paramMap.subscribe(params => {
              this.lang = params.get('lang');
              this.router.navigate([`${this.lang}/car-details`])
            })
          }
        }
        else if(res.statusCode == 204){
          this.serverSideError = data.message;
        }
        else if(res.statusCode == 400){
          this.serverSideError = data.message;
        }
        else{
          this.serverSideError = data.message;
        }
      },
      err => {
        this.serverSideError = "Not Found";
        console.log(this.serverSideError);
      }
     );
    }

    else if(this.customsCardForm.invalid){
      this.customsCardForm.markAllAsTouched();
      return;
    }
  }

}
