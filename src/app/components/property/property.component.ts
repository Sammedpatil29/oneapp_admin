import { Component, inject, OnInit } from '@angular/core';
import { EmptyDataComponent } from '../empty-data/empty-data.component';
import { LoaderComponent } from "../loader/loader.component";
import { FormsModule } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PropertyDialogComponent } from '../property-dialog/property-dialog.component';
import { AddGroceryComponent } from '../add-grocery/add-grocery.component';

@Component({
  selector: 'app-property',
  imports: [EmptyDataComponent, LoaderComponent, FormsModule],
  templateUrl: './property.component.html',
  styleUrl: './property.component.css'
})
export class PropertyComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  propertyData: any[] = [
  {
    "id": 1,
    "property_id": "prop_9912_a2b3",
    "property_name": "Kavya Emerald Gardens",
    "property_code": "KEG-ATH-002",
    "property_type": "Residential",
    "sub_type": "Villa",
    "listing_type": "For Sale",
    "status": "Available",
    "location": {
      "address_line_1": "Near Basaveshwar Circle",
      "address_line_2": "Saptapur Road",
      "landmark": "Behind Government Hospital",
      "city": "Athani",
      "district": "Belagavi",
      "state": "Karnataka",
      "pincode": 591304,
      "geography": {
        "latitude": 16.7355,
        "longitude": 75.0680,
        "google_place_id": "ChIJT_x-eb7_vzsR_alt"
      }
    },
    "specifications": {
      "total_area": 2400.00,
      "built_up_area": 1850.00,
      "area_unit": "sq_ft",
      "bhk_count": 4,
      "bathrooms": 4,
      "balconies": 2,
      "floor_number": 0,
      "total_floors": 2,
      "facing": "North",
      "furnished_status": "Fully-furnished",
      "age_of_property": 2
    },
    "financials": {
      "base_price": 8500000,
      "price_per_unit": 3541,
      "booking_amount": 500000,
      "maintenance_charges": 3000,
      "tax_rate": 5,
      "is_negotiable": false,
      "currency": "INR"
    },
    "amenities": ["Private Garden", "Solar Water Heater", "CCTV", "Car Parking", "Rainwater Harvesting"],
    "infrastructure": {
      "water_source": "Borewell",
      "power_backup": true,
      "parking_slots": 2
    },
    "legal": {
      "owner_name": "Vinayak Patil",
      "owner_contact": "+91-9900887766",
      "registration_number": "ATH-BK1-2024-112",
      "khata_type": "A-Khata",
      "rera_id": "PRM/KA/RERA/0987/112",
      "is_verified": true,
      "is_legal_dispute": false,
      "survey_number": "104/A"
    },
    "media": {
      "cover_image": "https://dummyimage.com/400x400/1f77b4/fff",
      "gallery": ["https://api.pintuapp.com/v1/assets/prop_9912_ext.webp"],
      "floor_plan_url": "https://api.pintuapp.com/v1/assets/prop_9912_plan.pdf",
      "video_tour_url": null
    },
    "metadata": {
      "created_by": "admin_sammed",
      "assigned_agent_id": "agent_002",
      "view_count": 89,
      "created_at": "2026-04-20T09:00:00Z",
      "updated_at": "2026-04-25T11:30:00Z"
    }
  },
  {
    "property_id": "prop_7734_c4d5",
    "property_name": "Pintu Logistics Hub",
    "property_code": "PLH-KNT-99",
    "property_type": "Industrial",
    "sub_type": "Warehouse",
    "listing_type": "Lease",
    "status": "Available",
    "location": {
      "address_line_1": "KIADB Industrial Area",
      "address_line_2": "Plot 14-B",
      "landmark": "Near Highway Toll",
      "city": "Belagavi",
      "district": "Belagavi",
      "state": "Karnataka",
      "pincode": 590001,
      "geography": {
        "latitude": 15.8497,
        "longitude": 74.4977,
        "google_place_id": "ChIJ_f6_vzsR3SuX_ind"
      }
    },
    "specifications": {
      "total_area": 15000.00,
      "built_up_area": 14500.00,
      "area_unit": "sq_ft",
      "bhk_count": 0,
      "bathrooms": 2,
      "balconies": 0,
      "floor_number": 0,
      "total_floors": 1,
      "facing": "South",
      "furnished_status": "Unfurnished",
      "age_of_property": 5
    },
    "financials": {
      "base_price": 120000,
      "price_per_unit": 8,
      "booking_amount": 360000,
      "maintenance_charges": 15000,
      "tax_rate": 18,
      "is_negotiable": true,
      "currency": "INR"
    },
    "amenities": ["Loading Dock", "24/7 Security", "Fire Sprinklers", "Heavy Vehicle Access"],
    "infrastructure": {
      "water_source": "Corporation",
      "power_backup": true,
      "parking_slots": 10
    },
    "legal": {
      "owner_name": "Gundappa Enterprises",
      "owner_contact": "+91-9448833221",
      "registration_number": "BEL-IND-2021-88",
      "khata_type": "A-Khata",
      "rera_id": null,
      "is_verified": true,
      "is_legal_dispute": false,
      "survey_number": "882/1"
    },
    "media": {
      "cover_image": "https://dummyimage.com/400x400/ff7f0e/fff",
      "gallery": [],
      "floor_plan_url": null,
      "video_tour_url": "https://vimeo.com/example_warehouse"
    },
    "metadata": {
      "created_by": "system_bot",
      "assigned_agent_id": "agent_015",
      "view_count": 210,
      "created_at": "2026-03-15T14:00:00Z",
      "updated_at": "2026-04-28T08:45:00Z"
    }
  },
  {
    "property_id": "prop_4456_e6f7",
    "property_name": "May I Help You Foundation Office",
    "property_code": "MHF-OFF-01",
    "property_type": "Commercial",
    "sub_type": "Office Space",
    "listing_type": "For Rent",
    "status": "Hold",
    "location": {
      "address_line_1": "Suite 201, Unity Plaza",
      "address_line_2": "Main Market",
      "landmark": "Above Canara Bank",
      "city": "Athani",
      "district": "Belagavi",
      "state": "Karnataka",
      "pincode": 591304,
      "geography": {
        "latitude": 16.7280,
        "longitude": 75.0610,
        "google_place_id": "ChIJ_f6_vzsR3SuX_offc"
      }
    },
    "specifications": {
      "total_area": 800.00,
      "built_up_area": 750.00,
      "area_unit": "sq_ft",
      "bhk_count": 0,
      "bathrooms": 1,
      "balconies": 0,
      "floor_number": 2,
      "total_floors": 3,
      "facing": "East",
      "furnished_status": "Semi-furnished",
      "age_of_property": 10
    },
    "financials": {
      "base_price": 18000,
      "price_per_unit": 22.5,
      "booking_amount": 50000,
      "maintenance_charges": 1200,
      "tax_rate": 0,
      "is_negotiable": true,
      "currency": "INR"
    },
    "amenities": ["High-speed Internet", "Lift", "Drinking Water", "Common Reception"],
    "infrastructure": {
      "water_source": "Corporation",
      "power_backup": false,
      "parking_slots": 2
    },
    "legal": {
      "owner_name": "Foundation Trust",
      "owner_contact": "+91-8888777766",
      "registration_number": "ATH-COMM-2016-12",
      "khata_type": "A-Khata",
      "rera_id": null,
      "is_verified": true,
      "is_legal_dispute": false,
      "survey_number": "N/A"
    },
    "media": {
      "cover_image": "https://dummyimage.com/400x400/2ca02c/fff",
      "gallery": ["https://api.pintuapp.com/v1/assets/prop_4456_int1.webp"],
      "floor_plan_url": null,
      "video_tour_url": null
    },
    "metadata": {
      "created_by": "admin_sammed",
      "assigned_agent_id": "agent_001",
      "view_count": 45,
      "created_at": "2026-01-10T11:00:00Z",
      "updated_at": "2026-04-20T16:20:00Z"
    }
  },
  {
    "property_id": "prop_1122_g8h9",
    "property_name": "Krishna River View Farm",
    "property_code": "KRV-PLT-05",
    "property_type": "Agricultural",
    "sub_type": "Farm Land",
    "listing_type": "For Sale",
    "status": "Available",
    "location": {
      "address_line_1": "Ghataprabha Road",
      "address_line_2": "Near River Bank",
      "landmark": "2km from Village Entrance",
      "city": "Hulagbali",
      "district": "Belagavi",
      "state": "Karnataka",
      "pincode": 591304,
      "geography": {
        "latitude": 16.6500,
        "longitude": 75.1000,
        "google_place_id": "ChIJ_f6_vzsR3SuX_farm"
      }
    },
    "specifications": {
      "total_area": 5.5,
      "built_up_area": 0,
      "area_unit": "acres",
      "bhk_count": 0,
      "bathrooms": 0,
      "balconies": 0,
      "floor_number": 0,
      "total_floors": 0,
      "facing": "West",
      "furnished_status": "Unfurnished",
      "age_of_property": 0
    },
    "financials": {
      "base_price": 11000000,
      "price_per_unit": 2000000,
      "booking_amount": 1000000,
      "maintenance_charges": 0,
      "tax_rate": 0,
      "is_negotiable": true,
      "currency": "INR"
    },
    "amenities": ["Fencing", "Drip Irrigation", "Farm House Foundation", "Fruit Trees"],
    "infrastructure": {
      "water_source": "Borewell",
      "power_backup": false,
      "parking_slots": 5
    },
    "legal": {
      "owner_name": "Siddappa Kulkarni",
      "owner_contact": "+91-9123456789",
      "registration_number": "ATH-AGRI-2025-998",
      "khata_type": "B-Khata",
      "rera_id": null,
      "is_verified": false,
      "is_legal_dispute": false,
      "survey_number": "112/4/C"
    },
    "media": {
      "cover_image": "https://dummyimage.com/400x400/d62728/fff",
      "gallery": ["https://api.pintuapp.com/v1/assets/prop_1122_river.webp"],
      "floor_plan_url": null,
      "video_tour_url": "https://youtube.com/watch?v=drone_farm"
    },
    "metadata": {
      "created_by": "admin_sammed",
      "assigned_agent_id": "agent_009",
      "view_count": 312,
      "created_at": "2026-04-01T10:00:00Z",
      "updated_at": "2026-04-28T12:00:00Z"
    }
  },
  {
    "property_id": "prop_3399_i0j1",
    "property_name": "Urban Skyline Studio",
    "property_code": "USS-BLR-001",
    "property_type": "Residential",
    "sub_type": "Studio Apartment",
    "listing_type": "For Sale",
    "status": "Under Construction",
    "location": {
      "address_line_1": "Electronic City Phase 1",
      "address_line_2": "Near Tech Park",
      "landmark": "Opposite Infosys Gate 4",
      "city": "Bengaluru",
      "district": "Bengaluru Urban",
      "state": "Karnataka",
      "pincode": 560100,
      "geography": {
        "latitude": 12.8448,
        "longitude": 77.6632,
        "google_place_id": "ChIJ_f6_vzsR3SuX_blr_e"
      }
    },
    "specifications": {
      "total_area": 550.00,
      "built_up_area": 480.00,
      "area_unit": "sq_ft",
      "bhk_count": 1,
      "bathrooms": 1,
      "balconies": 1,
      "floor_number": 12,
      "total_floors": 24,
      "facing": "East",
      "furnished_status": "Unfurnished",
      "age_of_property": 0
    },
    "financials": {
      "base_price": 3800000,
      "price_per_unit": 6909,
      "booking_amount": 200000,
      "maintenance_charges": 1800,
      "tax_rate": 12,
      "is_negotiable": false,
      "currency": "INR"
    },
    "amenities": ["Rooftop Infinity Pool", "Gym", "Smart Lock", "EV Charging Station"],
    "infrastructure": {
      "water_source": "Corporation",
      "power_backup": true,
      "parking_slots": 1
    },
    "legal": {
      "owner_name": "Skyline Builders",
      "owner_contact": "+91-8088009911",
      "registration_number": "BLR-PRJ-2025-001",
      "khata_type": "A-Khata",
      "rera_id": "PRM/KA/RERA/1251/447/PR/210125/004000",
      "is_verified": true,
      "is_legal_dispute": false,
      "survey_number": "221/9"
    },
    "media": {
      "cover_image": "https://dummyimage.com/400x400/9467bd/fff",
      "gallery": ["https://api.pintuapp.com/v1/assets/prop_3399_view.webp"],
      "floor_plan_url": "https://api.pintuapp.com/v1/assets/prop_3399_plan.pdf",
      "video_tour_url": null
    },
    "metadata": {
      "created_by": "system_bot",
      "assigned_agent_id": "agent_010",
      "view_count": 560,
      "created_at": "2026-02-28T09:00:00Z",
      "updated_at": "2026-04-28T10:00:00Z"
    }
  }
]
isLoading: boolean = false;
searchTerm = '';
filteredProperties: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filteredProperties = this.propertyData;
  }

  addNewproperty(){

  }

  searchProperties(){
    this.filteredProperties = this.propertyData.filter(property => {
      return property.property_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.property_code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.property_type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.sub_type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.listing_type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.location.address_line_1.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.location.address_line_2.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.location.landmark.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.location.city.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.location.district.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.location.state.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      property.specifications.total_area.toString().includes(this.searchTerm) ||
      property.specifications.built_up_area.toString().includes(this.searchTerm)
  })
}

openDialog(id:any, type:any, data:any){
  const dialogRef = this.dialog.open(PropertyDialogComponent, {
    data: {
      id: id,
      type: type,
      data: data
    },
    minWidth: '75vw',
    disableClose: true
  })
}

}
