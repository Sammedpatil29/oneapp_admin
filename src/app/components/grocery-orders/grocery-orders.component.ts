import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { CommonService } from '../../services/common.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { GroceryOrderDetailsComponent } from '../grocery-order-details/grocery-order-details.component';
import { LoaderComponent } from "../loader/loader.component";
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { OrdersSearchService } from '../../services/orders-search.service';

@Component({
  selector: 'app-grocery-orders',
  standalone: true,
  imports: [CommonModule, MatDialogModule, LoaderComponent],
  templateUrl: './grocery-orders.component.html',
  styleUrls: ['./grocery-orders.component.css']
})
export class GroceryOrdersComponent implements OnInit, OnDestroy {
  
  // Data initialized from your provided JSON
  orders: any[] = [];
  allOrders: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false
  private orderSubscription: Subscription | undefined;
  private searchSubscription: Subscription | undefined;
  private dateRangeSubscription: Subscription | undefined;
  startDateEpoch: number | null = null;
  endDateEpoch: number | null = null;


  constructor(private ordersService: OrdersService, private dialog: MatDialog, private socketService: SocketService, private searchService: OrdersSearchService){

  }

  ngOnInit() {
    this.getOrders()
    
    this.orderSubscription = this.socketService.on<any>('new order').subscribe((newOrder) => {
      if (newOrder) {
        // Add the new order to the beginning of the list
        this.allOrders.unshift(newOrder);
        this.filterOrders();
      }
    });

    this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.filterOrders();
    });

    this.dateRangeSubscription = this.searchService.dateRange$.subscribe(range => {
      this.startDateEpoch = range.start;
      this.endDateEpoch = range.end;
      this.handleDateChange();
    });
  }

  ngOnDestroy() {
    this.orderSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.dateRangeSubscription?.unsubscribe();
  }

  getOrders(silent: boolean = false){
    if (!silent) {
      this.isLoading = true;
    }
    this.ordersService.getOrders('grocery').subscribe((res:any)=>{
      this.allOrders = res.data || [];
      this.filterOrders();
      this.isLoading = false

    }, error => {
      this.isLoading = false
    })
  }

  handleDateChange() {
    console.log('Date range triggered:', this.startDateEpoch, this.endDateEpoch);
    // Add your specific logic here, e.g., fetching new data from the backend 
    // with date parameters, or locally filtering the existing 'allOrders' array.
    this.getOrders();
  }

  filterOrders() {
    if (!this.searchTerm) {
      this.orders = [...this.allOrders];
      return;
    }
    const term = this.searchTerm.toLowerCase().trim();
    this.orders = this.allOrders.filter(order => {
      const id = (order.id || order._id || '').toString().toLowerCase();
      const status = (order.status || '').toString().toLowerCase();
      return id.includes(term) || status.includes(term);
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-default';
    switch (status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  }

  viewOrder(order: any) {
  // Fallback 1: Input Validation
  console.log('called', order)
  const id = order.id || order._id
  if (!id) {
    console.error('Order ID is missing');
    return;
  }

  try {
    const dialogRef = this.dialog.open(GroceryOrderDetailsComponent, {
      width: '90%',
      maxWidth: '80vw',
      maxHeight: '90vh',
      autoFocus: false,
      data: {
        title: 'Order Details',
        body: `Viewing details for Order #${id}`,
        id: id,
        order: order
      }
    });

    // Fallback 2: Handle Dialog Close/Cancel
    dialogRef.afterClosed().subscribe(result => {
     
        this.getOrders(true);
    });

  } catch (error) {
    // Fallback 3: Component Load Failure
    console.error('Failed to open Order Details dialog:', error);
  }
}
}