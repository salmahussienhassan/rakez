import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDate',
  standalone: true
})
export class SearchDatePipe implements PipeTransform {


  transform(data: any[], date: string): any[] {
    
    return data.filter((data)=>{
     return  data.toString().includes(date)
     })
     
   }

}
