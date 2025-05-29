import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule, DatePipe } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {Validators} from '@angular/forms';
import {FormBuilder} from '@angular/forms';
import { SimulationService } from '../services/simulation.service';
import { DialogModule } from 'primeng/dialog';
import { BaseChartDirective } from 'ng2-charts';


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
  amount?: number;
  priority?: number;
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
    TableModule,
    InputNumberModule,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    BaseChartDirective
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
  canShowDialogChart: boolean = false;

  assignmentTypes: AssignmentType[] | undefined;
  productTypes: ProductType[] | undefined;

  availableInvestors: Investor[] | undefined;
  selectedInvestors: Investor[] | undefined;

  minDate: Date | undefined;
  pipe = new DatePipe('en-US')
  formattedDate: any
  date: any;
  predictionResult: any;
  predictionCountResult: any;
  tableData:any = [];

  isSubmittedForm: any;

  // chart
  barChartData:Array<any> = [];
  barChartLabels:Array<any> = [];
  barChartOptions:any = {
    responsive: true
  };
  barChartLegend:boolean = true;
  barChartType:string = 'line';


  ngOnInit() {
    this.minDate = new Date();
    this.isSubmittedForm = false;
    this.simulationService.getProductList().subscribe(data => {      
      this.productTypes = data;
    });

    this.simulationService.getAssignmentTypeList().subscribe(data => {
      this.assignmentTypes = data;
    });

    this.selectedInvestors = [];
 
  }

  onSubmit() {
    this.isSubmittedForm = true;
    this.formattedDate = this.pipe.transform(this.simulationForm.get('date')?.value, 'dd/MM/YYYY');
    const yyyy = this.pipe.transform(this.simulationForm.get('date')?.value, 'YYYY');
    const mm = this.pipe.transform(this.simulationForm.get('date')?.value, 'MM');
    const dd = this.pipe.transform(this.simulationForm.get('date')?.value, 'dd');
    

    this.selectedInvestors?.forEach((investor, i) => {
      investor.amount = this.simulationForm.get('amount' + investor.id)?.value
      investor.priority = i
    })    
    
    const product = this.simulationForm.get('productType')?.value as unknown as ProductType;
    const dataForm = {
      year: yyyy, 
      month: mm,
      day: dd,
      productId: (product as unknown as ProductType).id,
      investors: this.selectedInvestors
    }
    console.log(dataForm);

    this.simulationService.predict(dataForm).subscribe(data => {
      console.log(data);
      this.tableData = data.investorList;
      this.predictionResult = data.amount;
      this.predictionCountResult = data.count;
      let data1 = this.selectedInvestors?.map((i) => i.amount);
      data1?.push(0);
      let data2 = data.investorList.map((i: { predictAmount: number; }) => i.predictAmount);
      data2?.push(data.balanceAmount);
      let labels = data.investorList.map((i: { companyName: string; }) => i.companyName);
      labels?.push('SALDO DISPONIBLE');
      
      this.barChartData = [
        {data: data1, label: 'Monto requerido'},
        {data: data2, label: 'Monto disponible'},
      ];
      this.barChartLabels = labels;
      
      this.canShowDialog = true;

      this.tableData.push({
          "id": "",
          "companyName": "SALDO DISPONIBLE",
          "amount": null,
          "priority": null,
          "predictAmount": data.balanceAmount,
          "predictCount": data.balanceCount
      });
    });
    
    
  }

  getInvestorList(product:any, assignmentType:any) {
    this.simulationService.getInvestorList(product.id, assignmentType.id).subscribe(data => {
      this.availableInvestors = data;
    });
  }


  onChangeAssignmentParameters(event: any) {
    let product = this.simulationForm.get('productType')?.value;
    let assignmentType = this.simulationForm.get('assignmentType')?.value;

    if (assignmentType != '' && product != '' && assignmentType != null && product != null) {      
      this.getInvestorList(product, assignmentType)
    }
  
  }


  onSelectAllChange(event: any) {
    console.log(" this.simulationForm",  this.simulationForm);
    
    this.selectedInvestors = event.value;
    const name: any = 'amount'+event.itemValue.id;
    if (event.originalEvent.selected) {
      this.simulationForm.addControl(name, this.formBuilder.control('', [Validators.required]));
    } else {
      (this.simulationForm as any).removeControl(name);
    }   
  
  }

  hideDialog() {
    this.selectedInvestors?.forEach((investor, i) => {
      const name: any = 'amount'+investor.id;
      (this.simulationForm as any).removeControl(name);
    })  
    this.selectedInvestors = [];
    this.isSubmittedForm = false;
    this.simulationForm.reset();
    
  }

  showChart() {
    this.canShowDialogChart = true;
    this.canShowDialog = false;    
  }


}
