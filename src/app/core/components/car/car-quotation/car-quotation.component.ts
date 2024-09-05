import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DropdownValues, ResponseApi } from '../../../../shared/interfaces/response-api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';
import { DataService } from '../../../../shared/services/data.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarComponent } from "../../../../shared/components/progress-bar/progress-bar.component";
import { CarInfoService } from '../../../services/car-info.service';
import { CommonModule } from '@angular/common';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
declare var bootstrap: any;

@Component({
    selector: 'app-car-quotation',
    standalone: true,
    templateUrl: './car-quotation.component.html',
    styleUrl: './car-quotation.component.css',
    imports: [CommonModule,ReactiveFormsModule,TranslateModule,RouterLink, ProgressBarComponent, NgxOtpInputComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarQuotationComponent {
  activeIndex: number = 1;
  viewAll: boolean = false;
  againstOthers: boolean = true;
  including: boolean = false;
  typeRepair: boolean = false;
  coverageIncluded: boolean = false;
  additionalCoverages: boolean = false;
  showMore:boolean = false;
  loadData: boolean = true;
  loaderWrapper:any;
  benefits:any = [];
  carQuotation:any=[];
  carIncluding:any=[];
  productsArray:any = [];
  repairMethods:any;
  flagErrorInFile: boolean=false;
  errorMessageInFile!: string;
  shareLink!:string;
  valueDisplayed!:number;
  valueDisplayedIncluding!:number
  companyName!:string;
  showUploadImages: boolean=false;
  showUploadVideos:  boolean=false;
  uploadMediaForm!:FormGroup;
  firstSide!:File;
  secondSide!:File;
  thirdSide!:File;
  fourthSide!:File;
  copySuccess:boolean=false
  selectedImages: File[] = [];
  selectedVideos: File[] = [];
  advantages:boolean = false;
  private loaderTimeout: any
  activeStyle: any = {
      background: '#F97300',
      color: 'white'
    };
    inactiveStyle: any = {
      background: 'rgb(206 206 206)',
      color: '#213c75'
    };
  lang:any;
  medianRatio:string = "";
  totalCost: number = 4000;
  otpCode: any;
  otpForm!: FormGroup;
  sendPhoneForm!: FormGroup;
  // resendCodeBody!:ForgetPass;
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength: 6,
    autoFocus: true,
    autoBlur: true,
  };
  phonePattern = /^05\d{8}$/;
  isResendDisabled = true;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  serverSideError!:string;
  

  constructor(private fb: FormBuilder,http: HttpClient, private router: Router,
    private dataService: DataService,private dropDownService: ApiService,
    private activatedRoute:ActivatedRoute,private carInfo:CarInfoService){}

  ngOnInit(): void {
    // this.openModal()

    // send phone form
    this.sendPhoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required,Validators.pattern(this.phonePattern)]],
    });

    // otp form
    this.otpForm = this.fb.group({
      otp : [''],
    });
    this.startTimer();
    
    this.carQuotation=[
      {src:"../../../../../assets/images/partner/f7491971-c1d4-4f4e-ac1c-22a437db8bec_16x9_1200x676 1.svg",title:"ولاء للتأمين التعاوني"},
      {src:"../../../../../assets/images/partner/partner2.svg",title:" تكافل الراجحي"},
      {src:"../../../../../assets/images/partner/partner4.svg",title:"بروج للتأمين التعاوني  "},
      {src:"../../../../../assets/images/partner/partner6.svg",title:"التعاونية"},
      {src:"../../../../../assets/images/partner/partener9.svg",title:"ولاء للتأمين التعاوني"},
      {src:"../../../../../assets/images/partner/partener9.svg",title:"ولاء للتأمين التعاوني"}
    ]

    this.carIncluding=[
      {src:"../../../../../assets/images/partner/f7491971-c1d4-4f4e-ac1c-22a437db8bec_16x9_1200x676 1.svg",title:"ولاء للتأمين التعاوني"},
      {src:"../../../../../assets/images/partner/partner6.svg",title:"  التعاونية"},
      {src:"../../../../../assets/images/partner/partner5.svg",title:"  سلامة للتأمين التعاوني  "},
      {src:"../../../../../assets/images/partner/partner7.svg",title:"الاتحاد"},
      {src:"../../../../../assets/images/partner/partner3.svg",title:"الدرع العربي للتأمين  "},
      {src:"../../../../../assets/images/partner/partener9.svg",title:"ولاء للتأمين التعاوني"}
    ]

    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
      this.router.navigate([`${this.lang}/car-quotation`])
      this.shareLink =`https://rakes-agg-fe-ang.vercel.app/${this.lang}/car-quotation`;

      this.dropDownService.getDropDown(1,this.lang).subscribe((data:ResponseApi<DropdownValues[]>)=>{
        this.repairMethods = data.data;
      })
    })

    this.uploadMediaForm = this.fb.group({
      ImageFile1: [''],
      ImageFile2: [''],
      ImageFile3: [''],
      ImageFile4: [''],
      ImageFile5: [''],
      VideoFile1: [''],
      VideoFile2: [''],
      VideoFile3: [''],
      VideoFile4: [''],
      VideoFile5: ['']
    });

    this.benefits = [{id:1, name : 'coverage_of_natural_disasters', value: '300'}, {id:2, name : 'cover_broken_glass_and_fires', value: '400'},
    {id:3, name : 'personal_accident_coverage', value: '600'},{id:4, name : 'roadside_assistance_coverage', value: '1000'}]
  }

  ToggleCopySuccess(){
    this.copySuccess= false;
  }

  openModal() {
    const modalElement = document.getElementById('otp');
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement);
      myModal.show();
    }
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

  sendPhone(){}

  // resendCode(){
  //   this.startTimer();
  //   this.resendCodeBody = {
  //     email: this.emailVal,
  //   }
  //   this.register.postResendOtp(this.resendCodeBody).subscribe((res:any)=>{
        
  //       if(res.statusCode == 200){
  //       }
  //       else if(res.statusCode == 204){
  //         //empty data
  //         this.serverSideError = res.message;
  //       }
  //       else if(res.statusCode == 400){
  //         //data erro
  //         this.serverSideError = res.message;
  //       }
  //       else{
  //         this.serverSideError = res.message;
  //       }
  //     },
  //     (err:any) => {
  //       this.serverSideError = err.error.message;
  //     }
  //   );

  // }

  // confirmOtp(){
  //   if(this.otpCode.length > 5){
  //     this.register.postLogin2AF(this.otpCode, this.deriverInfo.userIdentity).subscribe((res:ResponseApi<registrationResponse>)=>{
  //       if(res.statusCode == 200){
  //         this.accountService.token = res.data.token;
  //         this.choosePayment(1, 'creditcard');
  //         this.showPaymentCard = true;
  //       }
  //       else if(res.statusCode == 204){
  //         this.serverSideError = res.message;
  //       }
  //       else if(res.statusCode == 400){
  //         this.serverSideError = res.message;
  //       }
  //       else{
  //         this.serverSideError = res.message;
  //       }
  //     },
  //     (err:any) => {
  //       this.serverSideError = err.error.message;
  //     }
  //     );}
    
  //     else{
  //       return;
  //     }
  
  // }


  takeValue(val:number, event: any){
    if(event.target.checked){
      this.totalCost = this.totalCost + val;
    } else if(!event.target.checked){
      this.totalCost = this.totalCost - val;
    }
  }

  uploadFile(event: any, side: number) {
    const file = event.target.files[0];
    const validImageTypes = ['image/png', 'image/gif', 'image/jpeg'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const maxImageSize = 10000000; // 10 MB
    const maxVideoSize = 50000000; // 50 MB

    if (this.showUploadImages) {
      if (!validImageTypes.includes(file.type)) {
        this.flagErrorInFile = true;
        this.errorMessageInFile = ".jpg او .png او .gif الرجاء تحميل نوع صورة يحمل اي من هذا الامتداد";
        console.log(this.errorMessageInFile);
      } else if (file.size > maxImageSize) {
        this.flagErrorInFile = true;
        this.errorMessageInFile = "يرجى تحميل صورةأقل من 10 ميغابايت";
        console.log(this.errorMessageInFile);
      } else {
        this.selectedImages[side - 1] = file;
        this.flagErrorInFile = false;
        console.log(this.selectedImages);
      }
    }
    else {
      if (!validVideoTypes.includes(file.type)) {
        this.flagErrorInFile = true;
        this.errorMessageInFile = ".mp4 او .webm او .ogg الرجاء تحميل نوع فيديو يحمل اي من هذا الامتداد";
        console.log(this.errorMessageInFile);
      } else if (file.size > maxVideoSize) {
        this.flagErrorInFile = true;
        this.errorMessageInFile = "يرجى تحميل فيديو أقل من 50 ميغابايت";
        console.log(this.errorMessageInFile);
      } else {
        this.selectedVideos[side - 1] = file;
        this.flagErrorInFile = false;
        console.log(this.selectedVideos);
      }
    }
  }


  get phoneNumber(){return this.sendPhoneForm.get('phoneNumber')}
  get ImageFile1() { return this.uploadMediaForm.get('ImageFile1');}
  get ImageFile2() { return this.uploadMediaForm.get('ImageFile2');}
  get ImageFile3() { return this.uploadMediaForm.get('ImageFile3');}
  get ImageFile4() { return this.uploadMediaForm.get('ImageFile4');}
  get ImageFile5() { return this.uploadMediaForm.get('ImageFile5');}

  get VideoFile1() { return this.uploadMediaForm.get('VideoFile1');}
  get VideoFile2() { return this.uploadMediaForm.get('VideoFile2');}
  get VideoFile3() { return this.uploadMediaForm.get('VideoFile3');}
  get VideoFile4() { return this.uploadMediaForm.get('VideoFile4');}
  get VideoFile5() { return this.uploadMediaForm.get('VideoFile5');}


  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  getVideoPreview(file: File): string {
    return URL.createObjectURL(file);
  }


  openuploadVideosForm(){
    this.showUploadVideos = !this.showUploadVideos;
    this.showUploadImages = false;
    this.VideoFile1?.reset();
    this.VideoFile2?.reset();
    this.VideoFile3?.reset();
    this.VideoFile4?.reset();
    this.VideoFile5?.reset();
  }

  openuploadImagesForm(){
     this.showUploadImages = !this.showUploadImages;
     this.showUploadVideos = false;
     this.ImageFile1?.reset();
     this.ImageFile2?.reset();
     this.ImageFile3?.reset();
     this.ImageFile4?.reset();
     this.ImageFile5?.reset();
  }


  displayValue(id:number){
    if(id===1)
      {
        this.valueDisplayed = 4000;
        this.valueDisplayedIncluding = 11000;
        this.companyName = '../../../../../assets/images/partner/partner8.svg';
      }
      else if(id===2)
        {
          this.valueDisplayed = 5000;
        }
  }

  copyUrl(): void {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        this.copySuccess=!this.copySuccess
      }).catch(err => {
        console.error('Failed to copy the URL: ', err);
      });
  }

  selectType(type:number){
    if(type === 1){
        this.viewAll = false;
        this.againstOthers = true;
        this.including = false;
        this.typeRepair = false;
    }

    if(type === 2){

        this.viewAll = false;
        this.againstOthers = false;
        this.including = true;
        this.typeRepair = true;
    }

    if(type === 3){
        this.viewAll = true;
        this.againstOthers = true;
        this.including = true;
        this.typeRepair = false;
    }

    this.activeIndex = type;
  }

  toggleContent(){
      this.showMore = !this.showMore;
  }

  showCoverageIncluded(){
   this.coverageIncluded = !this.coverageIncluded
  }

  showAdditionalCoverages(){
    this.additionalCoverages = !this.additionalCoverages
  }

  previousPage() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate([`${this.lang}/car-details`]);
  }

  get isButtonEnabled(): boolean {
    const imagesValid = this.selectedImages.length === 5 && this.selectedImages.every(img => img !== null);
    const videosValid = this.selectedVideos.length === 5 && this.selectedVideos.every(vid => vid !== null);
    return (imagesValid && this.showUploadImages) || (videosValid && this.showUploadVideos);
  }

  onSubmitIncluding(){
    if(this.isButtonEnabled)
      {
        const formData = new FormData();

        if(this.showUploadImages)
          {
            formData.append('leftSideFile', this.selectedImages[0])
            formData.append('topSideFile',this.selectedImages[1])
            formData.append('rightSideFile', this.selectedImages[2])
            formData.append('bottomSideFile', this.selectedImages[3])
            formData.append('middleSideFile', this.selectedImages[4])
            formData.append('isImage','true');
        }
        else {
          formData.append('leftSideFile', this.selectedVideos[0])
          formData.append('topSideFile', this.selectedVideos[1])
          formData.append('rightSideFile', this.selectedVideos[2])
          formData.append('bottomSideFile', this.selectedVideos[3])
          formData.append('middleSideFile', this.selectedVideos[4])
          formData.append('isImage','false');
        }
        formData.append('identityNumber','12312312');
        formData.append('serialNumber','12312312');
        this.dropDownService.UploadMedia(formData).subscribe(
          (data)=>{
          console.log(data);
        },
        (err)=>{
          console.log(err.error.message);
        }
        );

        this.medianRatio = "15%";
        localStorage.setItem('medianRatio', this.medianRatio);
        this.dataService.setActiveIcon('car-checkout');
        this.router.navigate([`${this.lang}/car-checkout`]);
    }
  }


  showAdvantages(){
    this.advantages = ! this.advantages;
  }


  onSubmit(): void {
    this.medianRatio = "2%";
    localStorage.setItem('medianRatio', this.medianRatio);
    if(this.uploadMediaForm)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    this.dataService.setActiveIcon('car-checkout');
    this.router.navigate([`${this.lang}/car-checkout`])
    this.carInfo.totalPrice.next(this.totalCost);
  }

}
