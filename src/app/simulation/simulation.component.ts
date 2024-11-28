import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';


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
    CommonModule
  ],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.css'
})
export class SimulationComponent {

  assignmentTypes: AssignmentType[] | undefined;
  selectedAssignmentType: AssignmentType | undefined;

  productTypes: ProductType[] | undefined;
  selectedProductType: ProductType | undefined;

  availableInvestors: Investor[] | undefined;
  selectedInvestors: Investor[] | undefined;
  draggedInvestor: Investor | undefined | null;


  date: any;


  ngOnInit() {
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

  dragStart(investor: Investor) {
      this.draggedInvestor = investor;
  }

  drop() {
    if (this.draggedInvestor) {
        let draggedInvestorIndex = this.findIndex(this.draggedInvestor);
        this.selectedInvestors = [...(this.selectedInvestors as Investor[]), this.draggedInvestor];
        this.availableInvestors = this.availableInvestors?.filter((val, i) => i != draggedInvestorIndex);
        this.draggedInvestor = null;
    }
  }

  dragEnd() {
    this.draggedInvestor = null;
  }

  findIndex(product: Investor) {
      let index = -1;
      for (let i = 0; i < (this.availableInvestors as Investor[]).length; i++) {
          if (product.id === (this.availableInvestors as Investor[])[i].id) {
              index = i;
              break;
          }
      }
      return index;
  }


}
