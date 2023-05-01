import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public segment: string = "list";
  isModalOpenEdit = false
  isModalOpen = false
  // isLoader = true
  customerData :any
  searchbarData :any
  searchFilterData :any
  constructor( private authService :AuthService , private firebaseService: FirebaseService) {}

ngOnInit(): void {
  this.getAllCustomerData()
    
}

  logout(){
    this.authService.signOut()
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }


  confirm(){

  }
  setOpen(isModalOpen: any , data:any){

  }
  setOpenEdit(isOpen: boolean) {
    this.isModalOpenEdit = isOpen;
  }
  getAllCustomerData() {
    this.firebaseService.getAllData().subscribe((res: any) => {
      if (res) {
        this.customerData = res
      }
    })
  }
  searchData(){
    this.searchFilterData  = this.customerData.filter((id:any) => id.mobileNo == Number(this.searchbarData) || id.firstName?.toLowerCase() == this.searchbarData?.toLowerCase())
    console.log(this.searchFilterData  ,"searchFilterData ===========");

  }
}
