import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProgramPromotion } from '../../../../../interfaces/program-promotion';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-program-promotions',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, TranslateModule,FormsModule],
  templateUrl: './program-promotions.component.html',
  styleUrl: './program-promotions.component.css'
})
export class ProgramPromotionsComponent {
  programs:ProgramPromotion[]=[];
  emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  clickToJoin: boolean[] = [];
  isPromotionProgramsFormVisible:boolean=false;
  Description!:string;
  JoinNowFlag:boolean=false;
  JoinNowFlagBtn:boolean=false;
  ProgramDesFlag:boolean=false;
  lang:any;
successJoining:boolean=false
ProgramsJoined:boolean=false

  EmailForm=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.pattern(this.emailPattern)]),
  })

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.snapshotUrl();
    this.programs = [
      { id: 1, name: '1وزارة الداخلية وقطاعاتها', description: ' وزارة الداخلية وقطاعتها 1',active:false },
      { id: 2, name: '2وزارة الداخلية وقطاعاتها', description: 'وزارة الداخلية وقطاعتها 2 ' ,active:false },

    ];
 
   
  
  }

  SubmitEmail(form:any){
    if(form.valid){

      this.successJoining = true;
  
      // Set a timeout to toggle the flag back after 3 seconds
      setTimeout(() => {
        this.JoinNowFlagBtn =!this.JoinNowFlagBtn
          this.successJoining = false;
          this.JoinNowFlag=!this.JoinNowFlag
          this.ProgramDesFlag=!this.ProgramDesFlag
          this.ProgramsJoined =!this.ProgramsJoined
      }, 1000);
    }
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }

  get email(){return this.EmailForm.get('email')}


  ShowDescription(id:any){
  console.log(id)
  this.JoinNowFlag = true
  const program = this.programs.find(program => program.id === id);
  this.Description = program ? program.description : '';
  this.isPromotionProgramsFormVisible = !this.isPromotionProgramsFormVisible;
  }

  ShowEmailForm(){
    this.JoinNowFlagBtn=true
    this.ProgramDesFlag =true
  }

  
  showPromtionPrograms() {
    this.isPromotionProgramsFormVisible = !this.isPromotionProgramsFormVisible;
  }

  toggleClickToJoin(index: number) {
    this.clickToJoin[index] = !this.clickToJoin[index];
  }


}