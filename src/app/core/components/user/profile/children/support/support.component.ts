import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketsService } from '../../../../../../shared/services/tickets.service';
import { ApiService } from '../../../../../../shared/services/api.service';
import { LangService } from '../../../../../../shared/services/lang.service';
import { DropdownValues, ResponseApi } from '../../../../../../shared/interfaces/response-api';
import Swal from 'sweetalert2';
import { TicketStatusDirective } from '../../../../../directives/ticket-status.directive';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, TranslateModule,FormsModule, TicketStatusDirective],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent implements OnInit  {
addTicketFlag:boolean=false
  addTicketForm!:FormGroup;
  selectedOption!:string ;
  file!:File;
  file1!:File;
  file2!:File;
  file3!:File;
  fileName!: string;
  fileName1!: string;
  fileName2!: string;
  fileName3!: string;
  selectText: string='ChooseASearchMethod';
  flagErrorInFile: boolean=false;
  errorMessageInFile!: string;
  lang:any;
  ticketsTypeVisible:boolean=false;
  currentUrl:string = '';
  phonePattern = /^05\d{8}$/;
  tickets:any=[];
  addTicketMess:string="";
  serverSideError!:string;
  ticketsTypes:any=[];
  status:any=[];
  ticketId = "";
  addSuccess= "";

 constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private ticketService: TicketsService,
  private dropDownService: ApiService, private langService:LangService){}
  ngOnInit(): void {
    this.snapshotUrl();
    this.addTicketForm = this.fb.group({
      TicketType:['', Validators.required],
      IDNumber:['', [Validators.required,Validators.minLength(10)]],
      Phone:['', [Validators.required,Validators.pattern(this.phonePattern)]],
      Description:['', [Validators.required]],
      File:[''],
    })
    this.langService.language$.subscribe({
      next: (res) => {
        this.lang = res;
        this.getTicketsTypes(this.lang);
        this.getTickets(this.lang);
      }
    });
  }

  get TicketType(){return this.addTicketForm.get('TicketType')}
  get IDNumber(){return this.addTicketForm.get('IDNumber')}
  get Phone(){return this.addTicketForm.get('Phone')}
  get File(){return this.addTicketForm.get('File')}
  get Description(){return this.addTicketForm.get('Description')}

  getTicketsTypes(language: string) {
    this.dropDownService.getDropDown(27, language).subscribe((data: ResponseApi<DropdownValues[]>) => {
      this.ticketsTypes = data.data;
    });
  }

  getTickets(language: string){
    this.ticketService.getTickets(language).subscribe((data: ResponseApi<any[]>) => {
      this.tickets = data.data;
    });
  }

  snapshotUrl(){
    this.activatedRoute.paramMap.subscribe(params => {
      this.lang = params.get('lang');
    })
  }

  ShowAddTicket(){
    this.addTicketFlag = !this.addTicketFlag
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


  removeFileName()
  {
    this.fileName='';
    this.fileName1='';
    this.fileName2='';
    this.fileName3='';
  }

  uploadFile(event:any){
    const file = event.currentTarget.files[0];
    if(file.type === "application/pdf" && file.size < 10000000)
      {
        this.flagErrorInFile=false;
       this.file = file;
       this.fileName = file.name;
       console.log(this.file)
      }
      else{
        if(file.type !== "application/pdf")
          {
            this.flagErrorInFile=true;
            this.errorMessageInFile="يرجى تحميل ملف PDF";
          }
        else if(file.size < 10000000){
          this.flagErrorInFile=true;
          this.errorMessageInFile="يرجى تحميل ملف أقل من 10 ميغابايت";
        }
      }
  }

  uploadFileOrImage(event: any) {
    const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const file = event.currentTarget.files[0];
    const maxSize = 10000000; // 10 MB
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if ((file.type === "application/pdf" || (file.type.startsWith("image/") && allowedImageExtensions.includes(fileExtension))) && file.size < maxSize) {
      this.flagErrorInFile = false;
      this.file = file;
      this.fileName = file.name;
      console.log(this.file);
    }
    else {
      this.flagErrorInFile = true;
      if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
        this.errorMessageInFile = "يرجى تحميل ملف PDF أو صورة";
      } else if (file.type.startsWith("image/") && !allowedImageExtensions.includes(fileExtension)) {
        this.errorMessageInFile = `يرجى تحميل صورة بامتداد ${allowedImageExtensions.join(', ')}`;
      } else if (file.size >= maxSize) {
        this.errorMessageInFile = "يرجى تحميل ملف أقل من 10 ميغابايت";
      }
    }
  }

ValidateNumber(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  const isNumber = charCode >= 48 && charCode <= 57;
  if (!isNumber) {
    event.preventDefault();
  }
}


onSubmit(){
  if((this.addTicketForm.valid))
      {
        const formData = new FormData();
        if(this.addTicketForm.valid)
          {
            formData.append('DropDownValueId',this.addTicketForm.value.TicketType);
            formData.append('UserId',this.addTicketForm.value.IDNumber);
            formData.append('PhoneNumber',this.addTicketForm.value.Phone);
            formData.append('Description',this.addTicketForm.value.Description);
            formData.append('Attachments',this.file);
          }
        this.ticketService.createTicket(formData).subscribe((res)=>{
          if(this.lang == "ar"){
            this.addSuccess = "تم اضافة التذكرة بنجاح ";
            this.ticketId = "رقم التذكرة"
          }

          else{
            this.addSuccess ="Ticket added successfully"
            this.ticketId = "Ticket No";
          }
    
        if(res.statusCode == 200){
          Swal.fire({
            icon: "info",
            text: this.addSuccess + this.ticketId + res.data.id
          });
          this.ticketsTypeVisible = false;
          this.addTicketForm.reset();
          this.getTickets(this.lang);
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
    )}
    else{
      this.ticketsTypeVisible = true;
      this.addTicketForm.markAllAsTouched();
      return;
    }
  }
}
