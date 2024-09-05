import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarComponent } from "../../../../shared/components/progress-bar/progress-bar.component";
import { Drivers } from '../../../interfaces/drivers';
import { CarDetails } from '../../../interfaces/car-details';
import { DataService } from '../../../../shared/services/data.service';
import { ApiService } from '../../../../shared/services/api.service';
import { CarDetailsService } from '../../../services/car-details.service';
import { DropdownValues, ResponseApi } from '../../../../shared/interfaces/response-api';
import { HideIdPipe } from '../../../pipes/hide-id.pipe';
import { HideNamePipe } from '../../../pipes/hide-name.pipe';
import { CarInfoService } from '../../../services/car-info.service';
import { EnToArCarNumberPipe } from '../../../pipes/en-to-ar-car-number.pipe';
import { LangService } from '../../../../shared/services/lang.service';

@Component({
    selector: 'app-car-details',
    standalone: true,
    templateUrl: './car-details.component.html',
    styleUrl: './car-details.component.css',
    imports: [EnToArCarNumberPipe, HideNamePipe,HideIdPipe,ReactiveFormsModule, CommonModule, RouterLink, TranslateModule, ProgressBarComponent]
})
export class CarDetailsComponent implements OnInit  {
    isPurchaseFormVisible: boolean = false;
    isAdditionalFormVisible: boolean = false;
    isAddDriversFormVisible: boolean = false;
    isPromotionProgramsFormVisible: boolean = false;
    isInsurenceRequest: boolean = false;
    isTrafficViolations: boolean = false;
    isDegreeKinship: boolean = false;
    isModificationsOrAdditionsVehicle: boolean = false;
    isViolations: boolean = false;
    isWorkcity: boolean = false;
    isTrailer: boolean = false;
    isOwnerRestrictions = false
    isOwnerLicence:boolean = false;
    editRow:boolean = false;
    showAddDriver:boolean = true;
    isDriverWorkCity = false;
    carInfoForm!: FormGroup;
    ownerInfoForm!: FormGroup;
    driversForm!: FormGroup;
    currentLanguage: any;
    ownerDriverId:any;
    newOwnerDriverId:any;
    driversArray: Array<Drivers> = [];
    newDriver: Drivers = {} as Drivers;
    driversList:any =[];
    Days: number[] = [];
    years: any[] = [];
    meladiyears: any[] = [];
    newDriverIdFirstChar:any;
    newDriverId:any;
    birthdate: any;
    showHijriCalendar = true;
    showMeladiCalendar = false;
    vehicalValuePattern = /^[1-9]\d{3,}$/;
    currentYear: number = new Date().getFullYear();
    driverPrecetage:any;
    ownerLeadershipRatio:any;
    minYears: number = Math.round((this.currentYear - 622) * (33 / 32)) - 101;
    maxYears: number = Math.round((this.currentYear - 622) * (33 / 32)) - 20; 
    minmeladiYears: number = Math.round((this.currentYear) * (33 / 32)) - 163;
    maxmeladiYears: number = Math.round((this.currentYear) * (33 / 32)) - 80;
    clickSaveNew : boolean = false;
    myCustomMonthDDL: any;
    myCustomYearDDL: any;
    identityNotMatched = false;
    sumLeadershipRatio:number = 0;
    leadershipRatio:any;
    EducationLevels:any;
    NumbersOfChildren:any;
    AccidentNumbers:any;
    ParkVehiclePlaces:any;
    Restrictions:any;
    MotionVectors:any;
    KilometersExpected:any;
    PurposesForUsing:any;
    KinshipDegrees:any;
    Countries:any ;
    cities:any;
    traffics:any;
    health:any;
    availableOptions:any;
    emptyData!:string
    dataError!:string 
    serverSideError!:string;
    ownerInfoObj!:CarDetails;
    carInfo: any;
    selectedPrecentage!:Number;
    lang: any;
    currentUrl: string = '';
    newDriverForm: boolean = false;
    serialNumber: string = '';
    personalInfo:any;
    fullName!:string;
    userIdentity!:string;
    insuranceType:any;
    vehicleInfo:any;
    date:any;

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
  
     
  
    constructor(private fb: FormBuilder, private router: Router, private dataService: DataService,
      private dropDownService: ApiService, private ownerInfo: CarDetailsService,private langService:LangService,
      private carInfoService: CarInfoService, private activatedRoute: ActivatedRoute) {
        this.driversArray = [];
      }
  
    ngOnInit(): void {
   
      this.activatedRoute.paramMap.subscribe(params => {
        this.lang = params.get('lang');
        this.currentUrl = this.activatedRoute.snapshot.url.join('/').substring(3);
        this.router.navigate([`${this.lang}/car-details`])
        this.getDropdowns(this.lang);
      })

      this.carInfoForm = this.fb.group({
        Purpose: ['شخصي'],
        EstimatedVehicleValue: [20000, [Validators.required]],
      });

      this.ownerInfoForm = this.fb.group({
        EduLevel: ['جامعي'],
        NumberOfChildrenUnder16: ['0'],
        DriverNumberOFAccidents: ['لا يوجد'],
        Restrictions:['سيارة أوتوماتيك'],
        PlaceParkArNight: ['الشارع'],
        Motion: ['أوتوماتيك'],
        Trailer:[false],
        TrailerValue:[null],
        NumberKilometersExpectedTraveledAnnually: ['من 1 إلي 20,000 (كيلو متر)'],
        NumberOfKilometersTraveled: [null],
        ModificationsOrAdditionsVehicle: [false],
        VehicleEdits:[null],
        Violations: [null],
        ViolationsValue:[null],
        WorkCitySameNationalAddressCity: [null],
        CityWork: [null],
        OwnerRestrictions:[null],
        OwnerRestrictionsValue:[null],
        OwnerLicence: [null],
        OwnerLicenses: this.fb.array([this.ownerLicencsesArray()])
      })
  
      this.driversForm = this.fb.group({
        driverId: [null, [Validators.required, Validators.minLength(10)]],
        driverHijriMonth: [null, [Validators.required]],
        driverHijriYear: [null, [Validators.required]],
        driverMeladiMonth: [null, [Validators.required]],
        driverMeladiYear: [null, [Validators.required]],
        driverEduLevel: [null],
        driverNumberOFAccidents: [null],
        driverNumberOfChildrenUnder16: [null],
        driverPrecetages: [null, [Validators.required]],
        driverWorkCitySameNationalAddressCity: [false],
        driverInsuranceApplicantLicenses: [false],
        driverDegreeKinship: [false],
        licenses: this.fb.array([this.newLicencses()])
      }, { validator: this.uniqueIdentityValidator.bind(this) });
      
      this.vehicleInfo = localStorage.getItem('vehicleInfo');
      console.log("vehicleInfo", this.vehicleInfo);
      if(this.vehicleInfo !==  "[object Object]"){
        const info = JSON.parse(this.vehicleInfo)
         this.personalInfo = info.baseInfoForYakeenPersonDto;
         console.log("info" , info)
        if(this.lang =='ar'){
          this.fullName = `${this.personalInfo.firstName} ${this.personalInfo.fatherName} ${this.personalInfo.grandFatherName}`;
        }
        else{
          this.fullName = `${this.personalInfo.firstNameT} ${this.personalInfo.fatherNameT} ${this.personalInfo.grandFatherNameT}`;
        }

        this.carInfo = info.baseInfoForYakeenVehicleDto;
        this.userIdentity = this.carInfo.userIdentity;
        this.date = this.carInfo.date;
        this.insuranceType =  localStorage.getItem('insuranceType');
      }
    
      this.dataService.language$.subscribe({
        next: (res) => {
          this.currentLanguage = res;
        }
      });

      this.availableOptions = [25,50,75,100];

  
  
      this.generateYears(this.minYears, this.maxYears);
      this.generatemeladiYears(this.minmeladiYears, this.maxmeladiYears);
        this.ownerDriverId = localStorage.getItem('ownerId');
        this.newOwnerDriverId = localStorage.getItem('newOwnerId');
     // }
      this.driversArray = [
                            {driverId: this.userIdentity, name: this.fullName , leadershipRatio: 100, driverMeladiMonth:'12', driverMeladiYear:'1800'},
                          ]               
    }

    PromotionProgramsFlag:boolean=false
    otherInfoFlag:boolean=false
    driversInformationFlag:boolean=false

    PromotionPrograms(){
      this.PromotionProgramsFlag=true
      this.otherInfoFlag = false
      this.driversInformationFlag = false
    }
    otherInfo(){
    this.otherInfoFlag = true
    this.PromotionProgramsFlag=false
    this.driversInformationFlag = false
    }
    driversInformation(){
    this.driversInformationFlag = true
    this.PromotionProgramsFlag=false
    this.otherInfoFlag = false
    }
    activeTab: string = 'promotions'; // Set the initial active tab
    setActiveTab(tab: string) {
      this.activeTab = tab;
    }

    getDropdowns(language: string) {
      this.dropDownService.getDropDown(5, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.PurposesForUsing = data.data;
      });
  
      this.dropDownService.getDropDown(6, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.EducationLevels = data.data;
      });
  
      this.dropDownService.getDropDown(7, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.NumbersOfChildren = data.data;
      });
  
      this.dropDownService.getDropDown(10, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.AccidentNumbers = data.data;
      });
  
      this.dropDownService.getDropDown(8, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.ParkVehiclePlaces = data.data;
      });
  
      this.dropDownService.getDropDown(9, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.MotionVectors = data.data;
      });
  
      this.dropDownService.getDropDown(2, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.KilometersExpected = data.data;
      });
      this.dropDownService.getDropDown(13, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.KinshipDegrees = data.data;
      });
  
      this.dropDownService.getDropDown(12, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.Countries = data.data;
      });
  
      this.dropDownService.getDropDown(11, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.cities = data.data;
      });
  
      this.dropDownService.getDropDown(4, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.Restrictions = data.data;
      });
  
      this.dropDownService.getDropDown(15, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.health = data.data;
      });
  
      this.dropDownService.getDropDown(16, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
        this.traffics = data.data;
      });
    }
  
  
    // Put validation  of owner driver form
    get EstimatedVehicleValue() { return this.carInfoForm.get('EstimatedVehicleValue'); }
    get VehicleEdits() { return this.ownerInfoForm.get('VehicleEdits') }
    get TrailerValue() { return this.ownerInfoForm.get('TrailerValue') }
    get OwnerLicenses() { return this.ownerInfoForm.get('OwnerLicenses') as FormArray };
   
    
    showPurchaseProcess() {
      this.isPurchaseFormVisible = !this.isPurchaseFormVisible;
    }
  
    showAdditional() {
      this.isAdditionalFormVisible = !this.isAdditionalFormVisible;
    }
  
    showAddDrivers() {
      this.isAddDriversFormVisible = !this.isAddDriversFormVisible;
    }
  
    showPromtionPrograms() {
      this.isPromotionProgramsFormVisible = !this.isPromotionProgramsFormVisible;
    }
  
    generatemeladiYears(min:any, max:any) {
      for (let i = min; i <= max; i++) {
        this.meladiyears.push(i);
      }
      this.meladiyears.sort((a,b)=>(a>b? -1 : 1));
    }
  
    generateYears(min:any, max:any) {
      for (let i = min; i <= max; i++) {
        this.years.push(i);
      }
      this.years.sort((a,b)=>(a>b? -1 : 1));
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
    
    detectChangeNo(e:any) {
      this.newDriverId = this.driversForm.controls["driverId"].value;
      this.newDriverIdFirstChar = e.target['value'].charAt(0);
      if (this.newDriverIdFirstChar == 1) {
        this.showHijriCalendar = true;
        this.showMeladiCalendar = false;
        this.driversForm.controls["driverMeladiMonth"].setValue(null);
        this.driversForm.controls["driverMeladiYear"].setValue(null);
        this.driversForm.controls["driverMeladiMonth"].setValidators(null);
        this.driversForm.controls["driverMeladiMonth"].updateValueAndValidity();
        this.driversForm.controls["driverMeladiYear"].setValidators(null);
        this.driversForm.controls["driverMeladiYear"].updateValueAndValidity();
      }
      else {
        this.showMeladiCalendar = true;
        this.showHijriCalendar = false;
        this.driversForm.controls["driverHijriMonth"].setValue(null);
        this.driversForm.controls["driverHijriYear"].setValue(null);
        this.driversForm.controls["driverHijriMonth"].setValidators(null);
        this.driversForm.controls["driverHijriMonth"].updateValueAndValidity();
        this.driversForm.controls["driverHijriYear"].setValidators(null);
        this.driversForm.controls["driverHijriYear"].updateValueAndValidity();
      }
    }
  
    showModificationsOrAdditionsVehicle(){
      this.isModificationsOrAdditionsVehicle = !this.isModificationsOrAdditionsVehicle;
      this.ownerInfoForm.controls["VehicleEdits"].setValidators(Validators.required);
      this.ownerInfoForm.controls["VehicleEdits"].setValue('');
    }
  
    showViolations(){
      this.isViolations = !this.isViolations;
    }
  
    showOwnerRestrictions(){
      this.isOwnerRestrictions = !this.isOwnerRestrictions;
    }
  
    showOwnerLicence(){
      this.isOwnerLicence = !this.isOwnerLicence;
    }
  
    showWorkcity(){
      this.isWorkcity = !this.isWorkcity;
    }
  
    showTrailer(){
      this.isTrailer = !this.isTrailer;
      this.ownerInfoForm.controls["TrailerValue"].setValidators([Validators.required,Validators.pattern(this.vehicalValuePattern)]);
      this.ownerInfoForm.controls["TrailerValue"].setValue('');
    }
  
    // Add Licences at owner driver form
    ownerLicencsesArray(): FormGroup {
      return this.fb.group({
        ownerCountry: [null],
        ownerNumberOfYear: [null]
      })
    }
  
    addOwnerLicenseItem() {
      this.OwnerLicenses.push(this.ownerLicencsesArray());
    }
  
    removeOwnerLicenseItem(index: number) {
      if (this.OwnerLicenses.length > 1) {
        this.OwnerLicenses .removeAt(index);
      }
    }
  
    // Add Licences at add driver form
    newLicencses(): FormGroup {
      return this.fb.group({
        country: [null],
        numberOfYear: [null]
      })
    }
  
    addLicenseItem() {
      this.licenses.push(this.newLicencses());
    }
  
    removeLicenseItem(index: number) {
      if (this.licenses.length > 1) {
        this.licenses.removeAt(index);
      }
    }


    // Add Driver Form
    get driverId() { return this.driversForm.get("driverId"); }
    get driverHijriMonth() { return this.driversForm.get("driverHijriMonth"); }
    get driverHijriYear() { return this.driversForm.get("driverHijriYear"); }
    get driverMeladiMonth() { return this.driversForm.get("driverMeladiMonth"); }
    get driverMeladiYear() { return this.driversForm.get("driverMeladiYear"); }
    get driverPrecetageValidation() { return this.driversForm.get("driverPrecetages"); }
  
    get licenses() { return this.driversForm.get('licenses') as FormArray };
  
    showDriverWorkCity(){
      this.isDriverWorkCity = !this.isDriverWorkCity;
    }
  
    showInsurenceRequest() {
      this.isInsurenceRequest = !this.isInsurenceRequest;
    }
  
    showTrafficViolations() {
      this.isTrafficViolations = !this.isTrafficViolations;
    }
  
    showDegreeKinship() {
      this.isDegreeKinship = !this.isDegreeKinship;
    }
  
    previousPage() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.router.navigate([`${this.lang}/home`])
     
    }
  
    uniqueIdentityValidator = (control: AbstractControl): ValidationErrors | null => {
      if (!this.driversArray) {
          this.driversArray = [];
      }
  
      const currentDriverId = control.get('driverId');
      const duplicate = this.driversArray.some(driver => driver.driverId === currentDriverId?.value);
      if (duplicate) {
          currentDriverId?.setErrors({ uniqueIdentity: true });
          return { uniqueIdentity: true }; 
      } else {
          currentDriverId?.setErrors(null);
          return null; 
      }
  };
  
  
  driverPrecetagearr() {
    if(!this.editFlag)
      {
    this.driverPrecetage = this.driversForm.controls["driverPrecetages"].value;
    if (this.driversArray[0].leadershipRatio === 100) {
      return this.availableOptions =  [25,50,75,100];
    }
   else if (this.driversArray[0].leadershipRatio === 75) {
     
       return this.availableOptions =  [25,50,75];
    } 
    else if (this.driversArray[0].leadershipRatio ===  50) {
  
      return this.availableOptions =  [25,50];
    }
     else if (this.driversArray[0].leadershipRatio ===  25) {
     
      return  this.availableOptions =   [25];
    } 
   else{
      return null
   }
  }
  else{
    //console.log(this.selectedPrecentage);
    if (this.selectedPrecentage == 100) {
      return this.availableOptions =  [25,50,75,100];
    }
   else if (this.selectedPrecentage == 75) {
     
       return this.availableOptions =  [25,50,75];
    } 
    else if (this.selectedPrecentage  ==  50) {
  
      return this.availableOptions =  [25,50];
    }
     else if (this.selectedPrecentage  ==  25) {
     
      return  this.availableOptions =   [25];
    } 
   else{
      return null
   }
  }
    
  }
  totalDriverPrecetages!:number;
      editFlag: boolean = false;
      indexEdit: number = 0;
      valueSelected:number = 0;
  
    editNewDriver(index: number) {
      this.editFlag = true;
      this.clickSaveNew = true;
      const row = this.driversList[index-1];
      this.indexEdit = index; 
      this.driversForm.setValue(row);
      this.selectedPrecentage = Number(row.driverPrecetages) + this.driversArray[0].leadershipRatio;
    }

    changeEditFlagState(){
      this.editFlag = false;
      this.newDriverForm = !this.newDriverForm;
    }

    saveNewDriver() {    
      if(this.editFlag)
        {
          this.driversArray[this.indexEdit].driverId = this.driversForm.controls["driverId"].value;
          this.driversArray[this.indexEdit].driverHijriMonth = this.driversForm.controls["driverHijriMonth"].value;
          this.driversArray[this.indexEdit].driverHijriYear = this.driversForm.controls["driverHijriYear"].value;
          this.driversArray[this.indexEdit].driverMeladiMonth = this.driversForm.controls["driverMeladiMonth"].value;
          this.driversArray[this.indexEdit].driverMeladiYear = this.driversForm.controls["driverMeladiYear"].value;
          this.driversList[this.indexEdit-1] = this.driversForm.value;
          this.driversList[this.indexEdit-1].driverPrecetages = this.driversForm.controls["driverPrecetages"].value;
          this.driversArray[this.indexEdit].leadershipRatio = this.driversForm.controls["driverPrecetages"].value;
         
         this.totalDriverPrecetages = this.driversList.reduce((total: number, driver: any) => {
          return total + parseFloat(driver.driverPrecetages);
      }, 0);

        this.driversArray[0].leadershipRatio  = Math.abs(100 - this.totalDriverPrecetages)  ;
          this.stateAddDriver();
        }
      this.clickSaveNew = false;
    }
  
    deleteRow(index: number) {
      this.driversArray[0].leadershipRatio +=Number(this.driversArray[index].leadershipRatio);
      this.driversArray.splice(index, 1);
      this.stateAddDriver();
      return true;
    }
    addDriver() {
      if (this.driversForm.valid) {
        if ( this.newDriverId.charAt(0) === '1') {
          this.myCustomMonthDDL =  this.driversForm.controls["driverHijriMonth"].value;
          this.myCustomYearDDL =  this.driversForm.controls["driverHijriYear"].value;
          this.birthdate = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
          this.newDriver = {
            driverId: this.newDriverId, 
            name: "عبدالهادي مختار" , 
            leadershipRatio: this.driverPrecetage,
            driverHijriMonth:this.driversForm.controls["driverHijriMonth"].value,
            driverHijriYear:this.driversForm.controls["driverHijriYear"].value,
          }
        }
    
        else{
          this.myCustomMonthDDL =  this.driversForm.controls["driverMeladiMonth"].value;
          this.myCustomYearDDL =  this.driversForm.controls["driverMeladiYear"].value;
          this.birthdate = this.myCustomYearDDL + '-' + this.myCustomMonthDDL;
          this.newDriver = {
            driverId: this.newDriverId, 
            name: "عبدالهادي مختار" , 
            leadershipRatio: this.driverPrecetage,
            driverMeladiMonth:this.driversForm.controls["driverMeladiMonth"].value,
            driverMeladiYear:this.driversForm.controls["driverMeladiYear"].value,
          }
        }
        
        this.ownerLeadershipRatio = this.driversArray[0].leadershipRatio;
        this.ownerLeadershipRatio =  this.ownerLeadershipRatio -  Number(this.driverPrecetage);
        this.driversArray[0].leadershipRatio =  this.ownerLeadershipRatio;
        this.driversArray.push(this.newDriver);
        this.driversList.push(this.driversForm.value);
        this.stateAddDriver();
        this.driversForm.reset();
      }

      if(this.driversForm.invalid){
       this.driversForm.markAllAsTouched();
      }
    }
    
    stateAddDriver() {
      for (var i = 0; i < this.driversArray.length; i++) {
        if(this.driversArray[0].leadershipRatio == 0) {
           this.showAddDriver = false;
        }
       else{
          this.showAddDriver = true;
        }
      }
    }
  
    onSubmit() {
     if(this.isModificationsOrAdditionsVehicle == false)
      {
        this.ownerInfoForm.controls["VehicleEdits"].setValidators(null);
        this.ownerInfoForm.controls["VehicleEdits"].updateValueAndValidity()
        this.ownerInfoForm.controls["VehicleEdits"].setValue(false);
      }
  
      if(this.isTrailer == false)
        {
          this.ownerInfoForm.controls["TrailerValue"].setValidators(null);
          this.ownerInfoForm.controls["TrailerValue"].updateValueAndValidity()
          this.ownerInfoForm.controls["TrailerValue"].setValue(false);
        }
  
  
      if (this.ownerInfoForm.invalid && this.carInfoForm.valid) {
        this.isAdditionalFormVisible = true;
        this.isPurchaseFormVisible = true;
        this.ownerInfoForm.markAllAsTouched();
        this.carInfoForm.markAllAsTouched();
        return;
      }
  
      if(this.ownerInfoForm.valid && this.carInfoForm.valid){
          this.ownerInfoObj = {
            userIdentity: JSON.stringify(this.userIdentity),
            usagePurpose: 1,
            vehicleValue: 1,
            educationLevel:  1,
            sonsNumber: 1,
            childrenNumber: 1,
            accidentsNumber: 1,
            drivingLicenseRestrictions: 1,
            parkingPlace: 1,
            motionVector: 1,
            kilometersNumber: 1,
            trailerValue: "2000",
            vehicleModification: "2200",
            healthConditions: 0,
            violations: 0,
            ownerDriverLicenses: [
              {
                id: 0,
                countryName: 0,
                yearsNumber: 0,
                ownerAdditionInfoId: 0
              }
            ]
        }
        
        this.ownerInfo.addOwnerAdditionInfo(this.ownerInfoObj).subscribe((data:ResponseApi<null>)=>{
            if(data.statusCode == 200){
              this.dataService.setActiveIcon('car-quotation');
              this.router.navigate([`${this.lang}/car-quotation`])
            }
            else if(data.statusCode == 204){
              this.emptyData = data.message;
            }
            else if(data.statusCode == 400){
              this.dataError = data.message;
            }
            else{
              this.serverSideError = data.message;
            }
          },
          err => {console.log("Error occurred");}
        );}
      }
}
