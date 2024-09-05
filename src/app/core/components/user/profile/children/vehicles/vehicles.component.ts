import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, TranslateModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent {
 
  constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute) { }
  VehiclesForm!: FormGroup;
  changeIcon:boolean =false;
  lang:any;
  
  ngOnInit(): void {
    this.snapshotUrl();
    this.VehiclesForm = this.fb.group({
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

  get documentNumber(){return this.VehiclesForm.get('documentNumber')}
  get serialCustomCard(){return this.VehiclesForm.get('serialCustomCard')}
  get IdentificationNumber(){return this.VehiclesForm.get('IdentificationNumber')}


  download(){
    this.changeIcon = !this.changeIcon;
  }

  onSubmit(){
    if(this.VehiclesForm.invalid){
      this.VehiclesForm.markAllAsTouched();
      return;
    }
  }

}