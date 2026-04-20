import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersSearchService {
  private searchSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchSubject.asObservable();

  private dateRangeSubject = new BehaviorSubject<{start: number | null, end: number | null}>({start: null, end: null});
  dateRange$ = this.dateRangeSubject.asObservable();

  setSearchTerm(term: string) {
    this.searchSubject.next(term);
  }

  setDateRange(start: number | null, end: number | null) {
    this.dateRangeSubject.next({ start, end });
  }
}