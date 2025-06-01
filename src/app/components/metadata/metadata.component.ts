import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-metadata',
  imports: [MatDialogModule, CommonModule, MatButtonModule,FormsModule, MatFormFieldModule, MatInputModule,MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.css'
})
export class MetadataComponent implements OnInit{
metaData: any;
latest_version = ''
download_link = ''
last_updated = ''
otherDetails = ''
  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getMetaData()
  }

  getMetaData(){
    this.commonService.getMetaData().subscribe(res => {
        this.metaData = res
        this.latest_version = this.metaData.latest_version
        this.download_link = this.metaData.download_link
        this.last_updated = this.metaData.last_updated
        this.otherDetails = this.metaData.video
    })
  }

  updateMetaData(){
    console.log('clicked')
    let params = {
      "id": this.metaData.id,
    "latest_version": this.latest_version,
    "last_updated": this.last_updated,
    "download_link": this.download_link,
    "video": this.otherDetails
    }
    this.commonService.updateMetaData(params, this.metaData.id).subscribe(res => {
      alert('details updated successfully')
    })
  }

}
