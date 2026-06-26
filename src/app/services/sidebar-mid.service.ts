import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarMidService {
  private value: BehaviorSubject<any> = new BehaviorSubject(null);
  $value = this.value.asObservable();

  constructor() { }

  setValue(newValue: any) {
    this.value.next(newValue);
  }
}