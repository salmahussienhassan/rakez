import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, TranslateModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  InsuranceDocumentForm!: FormGroup;
  changeIcon:boolean =false;
  test:any=['test1', 'test2'];
  lang:any;
  OngoingDocumentsFlag:boolean=true;
  ExpiredDocumentsFlag:boolean=false

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.snapshotUrl();
    this.InsuranceDocumentForm = this.fb.group({
    serialCustomCard:['', [Validators.required, Validators.minLength(10)]],
    IdentificationNumber:['', [Validators.required, Validators.minLength(10)]],
    documentNumber:['', Validators.required]
    })
  }

  OngoingDocuments(){
    this.OngoingDocumentsFlag=true
    this.ExpiredDocumentsFlag = false
  }

  ExpiredDocuments(){
this.ExpiredDocumentsFlag = true
this.OngoingDocumentsFlag=false
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
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

  get documentNumber(){return this.InsuranceDocumentForm.get('documentNumber')}
  get serialCustomCard(){return this.InsuranceDocumentForm.get('serialCustomCard')}
  get IdentificationNumber(){return this.InsuranceDocumentForm.get('IdentificationNumber')}


  download(){
    this.changeIcon = !this.changeIcon;
  }

  onSubmit(){
    if(this.InsuranceDocumentForm.invalid){
      this.InsuranceDocumentForm.markAllAsTouched();
      return;
    }
  }

}
