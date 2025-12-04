import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatOption } from "@angular/material/select";

@Component({
  selector: 'app-calculator',
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatRadioModule, MatFormField, MatLabel, MatOption],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
registerZomato: boolean = false;
  zomatoPayOption: 'now' | 'later' = 'now';

  registerSwiggy: boolean = false;
  swiggyPayOption: '600' | '1200' = '600';

  registerMagicpin: boolean = false;

  needFssai: boolean = false;
  fssaiYears: number = 1;

  totalAmount: number = 0;

  calculateTotal() {
    let total = 0;

    // Check if at least one service is selected
    const anyServiceSelected =
      this.registerZomato ||
      this.registerSwiggy ||
      this.registerMagicpin ||
      this.needFssai;

    // Add service charge once if any service is selected
    if (anyServiceSelected) {
      total += 1500;
    }

    // ZOMATO
    if (this.registerZomato) {
      if (this.zomatoPayOption === 'now') {
        total += 1200;
      }
      // 'later' means adding 0
    }

    // SWIGGY
    if (this.registerSwiggy) {
      if (this.swiggyPayOption === '600') {
        total += 600;
      } else {
        total += 1200;
      }
    }

    // MAGICPIN — always 0

    // FSSAI
    if (this.needFssai) {
      total += 100 * this.fssaiYears;
    }

    this.totalAmount = total;
  }
}
