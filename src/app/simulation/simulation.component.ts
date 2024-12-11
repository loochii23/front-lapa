import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule, DatePipe } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {Validators} from '@angular/forms';
import {FormBuilder} from '@angular/forms';
import { SimulationService } from '../services/simulation.service';
import { DialogModule } from 'primeng/dialog';


interface AssignmentType {
  id: string;
  description: string;
}

interface ProductType {
  id: string;
  name: string;
  code: string;
}

interface Investor {
  id: string;
  companyName: string;
}

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [
    FormsModule, 
    DropdownModule, 
    CardModule, 
    CalendarModule, 
    FloatLabelModule, 
    MultiSelectModule,
    ButtonModule,
    InputNumberModule,
    CommonModule,
    ReactiveFormsModule,
    DialogModule
  ],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.css'
})
export class SimulationComponent {
  
  constructor(
      private simulationService: SimulationService,
  ) { }

  private formBuilder = inject(FormBuilder);

  simulationForm = this.formBuilder.group({
    assignmentType: ['', Validators.required],
    productType: ['', Validators.required],
    investors: ['', Validators.required],
    date: ['', Validators.required]
  } );

  canShowDialog: boolean = false;

  assignmentTypes: AssignmentType[] | undefined;

  productTypes: ProductType[] | undefined;

  availableInvestors: Investor[] | undefined;
  selectedInvestors: Investor[] | undefined;

  minDate: Date | undefined;
  pipe = new DatePipe('en-US')
  formattedDate: any
  date: any;

  isSubmittedForm: any;



  ngOnInit() {
    this.minDate = new Date();
    this.isSubmittedForm = false;
    this.simulationService.getProductList().subscribe(data => {
      this.productTypes = data;
    });

    this.simulationService.getAssignmentTypeList().subscribe(data => {
      this.assignmentTypes = data;
    });

    /*this.assignmentTypes = [
        { description: 'Compra de cartera', id: '1' },
        { description: 'Garantía de Mutuo', id: '2' }
    ];

    this.productTypes = [
      { id: '1', name: 'RAPIFLEX', code:'RF' },
      { id: '2', name: 'RAPIPLAZO', code:'RP' },
    ];*/

    this.selectedInvestors = [];
    this.availableInvestors = [
      {"id":"de2e7d79780911ee89d00ad369ae5ae9","companyName":"ALMAVEST II 0 a 60"},
      {"id":"6c13d967780711ee89d00ad369ae5ae9","companyName":"ALMAVEST I 61 a 180"},
      {"id":"62a43f75202e11ee82590ad369ae5ae9","companyName":"ALMAVEST I 0 a 60"},
      {"id":"8ade01c13c7411ee852c0ad369ae5ae9","companyName":"IRIS"},
      {"id":"ec4fd848202d11ee82590ad369ae5ae9","companyName":"BONDSTER"},
      {"id":"899746299db740c69caece069a3ad841","companyName":"LATAM FINTECH LENDING"},
      {"id":"b34d87e689894a9d94bd21fcd600f5b7","companyName":"PARRADO INVESTMENT GROUP"}]
  }

  onSubmit() {
    this.isSubmittedForm = true;
    this.formattedDate = this.pipe.transform(this.simulationForm.get('date')?.value, 'dd/MM/YYYY');
    this.canShowDialog = true;
    console.warn(this.simulationForm.value);
  }

  getInvestorList(product:any, assignmentType:any) {
    this.simulationService.getInvestorList(product.id, assignmentType.id).subscribe(data => {
      this.availableInvestors = data;
    });
  }


  onChangeAssignmentParameters(event: any) {
    let product = this.simulationForm.get('productType')?.value;
    let assignmentType = this.simulationForm.get('assignmentType')?.value;

    if (assignmentType != '' && product != '') {
      // this.getInvestorList(product, assignmentType)
    }
  
  }


  onSelectAllChange(event: any) {
    this.selectedInvestors = event.value;
    const name: any = 'amount'+event.itemValue.id;
    if (event.originalEvent.selected) {
      this.simulationForm.addControl(name, this.formBuilder.control('', [Validators.required]));
    } else {
      this.simulationForm.get(name)?.disable();
    }   
  
  }


}
