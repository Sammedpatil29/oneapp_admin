import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogTitle, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatButton } from "@angular/material/button";
import { AddGroceryComponent } from '../add-grocery/add-grocery.component';

@Component({
  selector: 'app-property-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatButton, FormsModule],
  templateUrl: './property-dialog.component.html',
  styleUrl: './property-dialog.component.css'
})
export class PropertyDialogComponent implements OnInit{

  header: string = 'Add New Property'
  property_name: string = ''
  property_code: string = ''
  property_type: string = ''
  sub_type: string = ''
  listing_type: string = ''
  status: string = ''
  address_line_1: string = ''
  address_line_2: string = ''
  landmark: string = ''
  city: string = ''
  district: string = ''
  state: string = ''
  pincode: string = ''
  total_area: string = ''
  built_up_area: string = ''
  area_unit: string = ''
  bhk_count: string = ''
  bathrooms: string = ''
  balconies: string = ''
  floor_number: string = ''
  total_floors: string = ''
  facing: string = ''
  furnished_status: string = ''
  age_of_property: string = ''
base_price: string = ''
price_per_unit: string = ''
booking_amount: string = ''
maintenance_charges: string = ''
tax_rate: string = ''
is_negotiable: string = ''
currency: string = ''
amenities: string = ''
water_source: string = ''
power_backup: string = ''
parking_slots: string = ''
owner_name: string = ''
owner_contact: string = ''
registration_number: string = ''
khata_type: string = ''
rera_id: string = ''
is_verified: string = ''
is_legal_dispute: string = ''
survey_number: string = ''
cover_image: string = ''
floor_plan_url: string = ''
video_tour_url: string = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}

  ngOnInit(): void {
    if(this.data.type == 'add'){
      this.header = 'Add New Property'
    } else {
      this.header = 'Edit Property'
      this.property_name = this.data.data.property_name
      this.property_code = this.data.data.property_code
      this.property_type = this.data.data.property_type
      this.sub_type = this.data.data.sub_type
      this.listing_type = this.data.data.listing_type
      this.status = this.data.data.status
      this.address_line_1 = this.data.data.location.address_line_1
      this.address_line_2 = this.data.data.location.address_line_2
      this.landmark = this.data.data.location.landmark
      this.city = this.data.data.location.city
      this.district = this.data.data.location.district
      this.state = this.data.data.location.state
      this.pincode = this.data.data.location.pincode
      this.total_area = this.data.data.specifications.total_area
      this.built_up_area = this.data.data.specifications.built_up_area
      this.area_unit = this.data.data.specifications.area_unit
      this.bhk_count = this.data.data.specifications.bhk_count
      this.bathrooms = this.data.data.specifications.bathrooms
      this.balconies = this.data.data.specifications.balconies
      this.floor_number = this.data.data.specifications.floor_number
      this.total_floors = this.data.data.specifications.total_floors
      this.facing = this.data.data.specifications.facing
      this.furnished_status = this.data.data.specifications.furnished_status
      this.age_of_property = this.data.data.specifications.age_of_property
      this.base_price = this.data.data.financials.base_price
      this.price_per_unit = this.data.data.financials.price_per_unit
      this.booking_amount = this.data.data.financials.booking_amount
      this.maintenance_charges = this.data.data.financials.maintenance_charges
      this.tax_rate = this.data.data.financials.tax_rate
      this.is_negotiable = this.data.data.financials.is_negotiable
      this.currency = this.data.data.financials.currency
      this.amenities = this.data.data.amenities.join(', ')
      this.water_source = this.data.data.infrastructure.water_source
      this.power_backup = this.data.data.infrastructure.power_backup
      this.parking_slots = this.data.data.infrastructure.parking_slots
      this.owner_name = this.data.data.legal.owner_name
      this.owner_contact = this.data.data.legal.owner_contact
      this.registration_number = this.data.data.legal.registration_number
      this.khata_type = this.data.data.legal.khata_type
      this.rera_id = this.data.data.legal.rera_id
      this.is_verified = this.data.data.legal.is_verified
      this.is_legal_dispute = this.data.data.legal.is_legal_dispute
      this.survey_number = this.data.data.legal.survey_number
      this.cover_image = this.data.data.media.cover_image
      this.floor_plan_url = this.data.data.media.floor_plan_url
      this.video_tour_url = this.data.data.media.video_tour_url
    }
  }

  deletePropertyItem(){

  }

  updateProperty(){

  }

  createProperty(){

  }
}
