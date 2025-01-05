import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule
  ],

  template: `
    <div class="grid vertical-align-middle">
      <div class="col flex justify-content-center ">
          <a [routerLink]="['/simulation']" class="p-button font-bold">
              Predecir cartera
          </a>
      </div>
    </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
