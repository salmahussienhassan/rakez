import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [ReactiveFormsModule,ReactiveFormsModule,CommonModule,TranslateModule],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent    {
test:any=['test1', 'test2','test3']

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) { }
  changeIcon:boolean =false;
  isPromotionProgramsFormVisible:boolean=false
  EnterTheReceiptNumber:boolean=false
  TheIdentityoftheBeliever:boolean=false
  InsuranceCompany:boolean=false
  BillForm!: FormGroup;
  lang:any;

  ngOnInit(): void {
    this.snapshotUrl();
    this.BillForm = this.fb.group({
    serialCustomCard:['', [Validators.required, Validators.minLength(10)]],
    IdentificationNumber:['', [Validators.required, Validators.minLength(10)]],
    documentNumber:['', Validators.required]
    })
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }


  showInsuranceCompany(){
    this.TheIdentityoftheBeliever=false
    this.EnterTheReceiptNumber = false
    this.InsuranceCompany= !this.InsuranceCompany
    this.isPromotionProgramsFormVisible = !this.isPromotionProgramsFormVisible;
   
  }

  showTheIdentityoftheBeliever(){
    this.InsuranceCompany= false
    this.EnterTheReceiptNumber = false
    this.TheIdentityoftheBeliever= !this.TheIdentityoftheBeliever
 
  this.isPromotionProgramsFormVisible = !this.isPromotionProgramsFormVisible;
  
  }

  showEnterTheReceiptNumber(){
    this.InsuranceCompany= false
    this.TheIdentityoftheBeliever=false
    this.isPromotionProgramsFormVisible = !this.isPromotionProgramsFormVisible;
    this.EnterTheReceiptNumber = !this.EnterTheReceiptNumber
  }

  showPromtionPrograms() {
 
    this.isPromotionProgramsFormVisible = !this.isPromotionProgramsFormVisible;
  }

  ValidateNumber(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    const isNumber = charCode >= 48 && charCode <= 57;
    if (!isNumber) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(e: any) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
  
    if (e.which === 0 || e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    if (!/[0-9]/.test(input)) {
      e.preventDefault();
      return false;
    }
  
    const currentValue = e.target.value;
  
    if (currentValue.length === 0) {
      if (!/[1-2]/.test(input)) {
        e.preventDefault();
        return false;
      }
    }
  
    return true;
  }

  get documentNumber(){return this.BillForm.get('documentNumber')}
  get serialCustomCard(){return this.BillForm.get('serialCustomCard')}
  get IdentificationNumber(){return this.BillForm.get('IdentificationNumber')}


  download(){
    this.changeIcon = !this.changeIcon;
  }

  onSubmit(){
    if(this.BillForm.invalid){
      this.BillForm.markAllAsTouched();
      return;
    }
  }


}
