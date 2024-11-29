import { Component, inject } from '@angular/core';
import { AbstractControl, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FormGroup, FormControl} from '@angular/forms';
import {Validators} from '@angular/forms';
import {FormBuilder} from '@angular/forms';
import {FormArray} from '@angular/forms';
import { log } from 'console';


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
  name: string;
}

@Component({
  selector: 'app-simulation',
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
    ReactiveFormsModule
  ],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.css'
})
export class SimulationComponent {
  
  private formBuilder = inject(FormBuilder);

  simulationForm = this.formBuilder.group({
    assignmentType: ['', Validators.required],
    productType: ['', Validators.required],
    investors: ['', Validators.required],
    date: ['', Validators.required]
  } );

  assignmentTypes: AssignmentType[] | undefined;

  productTypes: ProductType[] | undefined;

  availableInvestors: Investor[] | undefined;
  selectedInvestors: Investor[] | undefined;


  date: any;

  isSubmittedForm: any;


  ngOnInit() {
    this.isSubmittedForm = false;
    this.assignmentTypes = [
        { description: 'Compra de cartera', id: '1' },
        { description: 'Garantía de Mutuo', id: '2' }
    ];

    this.productTypes = [
      { id: '1', name: 'RAPIFLEX', code:'RF' },
      { id: '2', name: 'RAPIPLAZO', code:'RP' },
    ];

    this.selectedInvestors = [];
    this.availableInvestors = [
        {id:'1', name: 'Mintos'},
        {id:'2', name: 'Bondster'}
    ]
  }

  onSubmit() {
    this.isSubmittedForm = true;
    console.warn(this.simulationForm.value);
    console.log(this.simulationForm.valid);
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
