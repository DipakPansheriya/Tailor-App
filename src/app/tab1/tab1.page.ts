import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { FirebaseService } from '../service/firebase.service';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderMaster } from '../interface/invoice';
import * as moment from 'moment';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  private mobileValidPattern: RegExp = new RegExp(/^\d{0,10}$/g);
  private allowedSpecialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete'
  ];
  public segment: string = "list";
  isModalOpenEdit = false
  jodiForm : FormGroup
  customerData :any
  searchbarData :any
  searchFilterData :any
  selectedType :any
  allPatterns :any
  pentPatternsList :any
  shirtPatternsList:any = []
  selectedPentPeattern:any = []
  selectedShirtPeattern:any = []
  pentTotalExtraCost :any
  shirtTotalExtraCost :any
  date:any
  currentDate = new Date();
  orderId :any
  customerId:any
  mobileNo:any
  fullName:any
  latestBillNo:any
  orderData:any
  searchCustomer:any
  allOrderList:any;
  selectedShirtPatterns : any = []
  selectedPentPatterns : any = []



  constructor( private authService :AuthService , 
    private firebaseService: FirebaseService, 
    private router:Router , 
    private fb:FormBuilder
    ) {}

ngOnInit(): void {
  this.getAllCustomerData()
  this.getAllOrders()
  this.getAllPatterns()
  this.buildJodiForm()
}


buildJodiForm() : void {
  this.jodiForm = this.fb.group({
    garmentType : [''],
    jodiQuantity: [0],
    pentL: [''],
    pentK: [''],
    shi: [''],
    mo: [''],
    ja: [''],
    jo: [''],
    go: [''],
    pentPatterns: [''],
    pentAdditionalDesc: [''],
    pentTotalExtraCost: [0],
    pentQuantity: [0],
    shirtQuantity: [0],
    shirtL: [''],
    ba: [''],
    cha: [''],
    sho1: [''],
    sho2: [''],
    sho3: [''],
    pe1: [''],
    pe2: [''],
    pe3: [''],
    pe4: [''],
    ko: [''],
    shirtK: [''],
    kh: [''],
    shirtPatterns: [''],
    shirtAdditionalDesc: [''],
    shirtTotalExtraCost: [0],
    deliveryDate: [''],
    shirtType: [''],
  })
}


  logout(){
    this.authService.signOut()
     Storage.remove({ key: 'authtoken' });
     this.router.navigate(['/login'])
  }

  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
  }


  confirm(){

  }

  setOpenEdit(isOpen: boolean) {
    this.isModalOpenEdit = isOpen;
    this.searchFilterData = ''
    this.searchCustomer = '';
    this.customerId = ''
    this.mobileNo = ''
    this.fullName = ''
    this.jodiForm.reset();
    this.jodiForm.controls['garmentType'].setValue('Jodi');
    this.orderId = '';
  }

  getAllCustomerData() {
    this.firebaseService.getAllData().subscribe((res: any) => {
      if (res) {
        this.customerData = res
      }
    })
  }
  getAllOrders(): void {
    this.firebaseService.getAllOrderMaster().subscribe(res => {
      this.allOrderList = res;
      this.allOrderList.sort((a: any, b: any) => b.billNumber - a.billNumber)
      this.latestBillNo = this.allOrderList.length === 0 ? 1 : Math.max(...this.allOrderList.map((o: any) => o.billNumber)) + 1      
    })

  }

  searchData(){    
    const existingCustomer = this.customerData.find((id: any) => id.mobileNo == this.searchbarData)
    if (existingCustomer) {
      this.fullName = existingCustomer.firstName + ' ' + existingCustomer.lastName;
      this.mobileNo = existingCustomer.mobileNo;
      this.customerId = existingCustomer.id;
    } else {
      alert("CustomerNotFound")
    }
    let customerData = this.allOrderList.find((id: any) => id.billNumber === Math.max(...this.allOrderList.filter((id: any) => id.customerId === existingCustomer.id).map((id: any) => id.billNumber)))
    if (customerData) {
      this.jodiForm.controls['garmentType'].setValue(customerData?.garmentType)
        this.jodiForm.controls['jodiQuantity'].setValue(Number(customerData?.quantity))
        this.jodiForm.controls['pentL'].setValue(customerData?.pentDetails?.pentL)
        this.jodiForm.controls['pentK'].setValue(customerData?.pentDetails?.pentK)
        this.jodiForm.controls['shi'].setValue(customerData?.pentDetails?.shi)
        this.jodiForm.controls['mo'].setValue(customerData?.pentDetails?.mo)
        this.jodiForm.controls['ja'].setValue(customerData?.pentDetails?.ja)
        this.jodiForm.controls['jo'].setValue(customerData?.pentDetails?.jo)
        this.jodiForm.controls['go'].setValue(customerData?.pentDetails?.go)
        this.jodiForm.controls['pentAdditionalDesc'].setValue(customerData?.pentDetails?.pentAdditionalDesc)
        this.jodiForm.controls['pentTotalExtraCost'].setValue(customerData?.pentDetails?.pentTotalExtraCost)
        this.jodiForm.controls['pentQuantity'].setValue(Number(customerData?.pentDetails?.quantity))
        debugger
        if(customerData?.pentDetails?.pentPatterns && customerData?.pentDetails?.pentPatterns?.length > 0){
          let datapent = customerData?.pentDetails?.pentPatterns?.map((id : any) => id.id) 
          this.jodiForm.controls['pentPatterns'].setValue(datapent)
          this.jodiPatternSelection('pent')
        }
        this.jodiForm.controls['shirtL'].setValue(customerData?.shirtDetails?.shirtL)
        this.jodiForm.controls['ba'].setValue(customerData?.shirtDetails?.ba)
        this.jodiForm.controls['cha'].setValue(customerData?.shirtDetails?.cha)
        this.jodiForm.controls['sho1'].setValue(customerData?.shirtDetails?.sho1)
        this.jodiForm.controls['sho2'].setValue(customerData?.shirtDetails?.sho2)
        this.jodiForm.controls['sho3'].setValue(customerData?.shirtDetails?.sho3)
        this.jodiForm.controls['pe1'].setValue(customerData?.shirtDetails?.pe1)
        this.jodiForm.controls['pe2'].setValue(customerData?.shirtDetails?.pe2)
        this.jodiForm.controls['pe3'].setValue(customerData?.shirtDetails?.pe3)
        this.jodiForm.controls['pe4'].setValue(customerData?.shirtDetails?.pe4)
        this.jodiForm.controls['ko'].setValue(customerData?.shirtDetails?.ko)
        this.jodiForm.controls['shirtK'].setValue(customerData?.shirtDetails?.shirtK)
        this.jodiForm.controls['kh'].setValue(customerData?.shirtDetails?.kh)
        if(customerData?.shirtDetails?.shirtPatterns && customerData?.shirtDetails?.shirtPatterns.length > 0){
          let data = customerData?.shirtDetails?.shirtPatterns?.map((id : any) => id.id) 
          this.jodiForm.controls['shirtPatterns'].setValue(data)
          this.jodiPatternSelection('shirt')
        }
        this.jodiForm.controls['shirtAdditionalDesc'].setValue(customerData?.shirtDetails?.shirtAdditionalDesc)
        this.jodiForm.controls['shirtTotalExtraCost'].setValue(customerData?.shirtDetails?.shirtTotalExtraCost)
        this.jodiForm.controls['deliveryDate'].setValue(new Date(customerData?.deliveryDate))
        this.jodiForm.controls['shirtType'].setValue(customerData?.shirtDetails?.shirtType)
        this.jodiForm.controls['shirtQuantity'].setValue(Number(customerData?.shirtDetails?.quantity))
    }
  }

  selectType(e:any) {
    this.selectedType = e.detail.value
  }

  jodiPatternSelection(type: any): void {
    if (type === 'pent') {
      let data : any = [];
      this.jodiForm.value.pentPatterns.forEach((element : any ) => {
        let selectedPattern = this.pentPatternsList.find((id : any) => id.id === element)
        if (selectedPattern) {
          data.push(selectedPattern)
        }
      });

      this.selectedPentPatterns = data
      if (this.selectedPentPatterns.length > 0) {
        const data = this.selectedPentPatterns.map((id: any) => Number(id.patternPrice))
        const finalAmount = data?.reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0)
        this.jodiForm.controls['pentTotalExtraCost'].setValue(finalAmount)
      } else {
        this.jodiForm.controls['pentTotalExtraCost'].setValue(0)
      }
      
    } else {
      let data : any = [];
      this.jodiForm.value.shirtPatterns.forEach((element : any ) => {
        let selectedPattern = this.shirtPatternsList.find((id : any) => id.id === element)
        if (selectedPattern) {
          data.push(selectedPattern)
        }
      });
      this.selectedShirtPatterns = data
      if (this.selectedShirtPatterns.length > 0) {
        const data = this.selectedShirtPatterns.map((id: any) => Number(id.patternPrice))
        const finalAmount = data?.reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0)
        this.jodiForm.controls['shirtTotalExtraCost'].setValue(finalAmount)
      } else {
        this.jodiForm.controls['shirtTotalExtraCost'].setValue(0)
      }
    }
  }

  getAllPatterns(): void {
    this.firebaseService.getAllPatterns().subscribe((res => {
      if (res) {
        this.allPatterns = res;
        this.shirtPatternsList = this.allPatterns.filter((id: any) => id.patternCategory === 'Shirt');
        this.pentPatternsList = this.allPatterns.filter((id: any) => id.patternCategory === 'Pent');    
      }
    }))
  }

  mobileInputRestriction(event: any): any {
    const value = event.target.value;
    if (this.allowedSpecialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = value;
    const position = event.target.selectionStart;
    const next: string = [
      current.slice(0, position),
      event.key === 'Decimal' ? '.' : event.key,
      current.slice(position)
    ].join('');
    if (next && !String(next).match(this.mobileValidPattern)) {
      event.preventDefault();
    }
  }


  onSubmit() : void {
    const payload: OrderMaster = {
      id: this.orderId ? this.orderId : '',
      garmentType: this.jodiForm.value.garmentType,
      customerId: this.customerId,
      customerMobileNo: this.mobileNo,
      customerName: this.fullName,
      status: 'Pending',
      billNumber: this.orderId ? this.orderData.billNumber : Number(this.latestBillNo),
      orderDate: moment().format('YYYY-MM-DD'),
      deliveryDate: moment(this.jodiForm.value?.deliveryDate).format('YYYY-MM-DD'),
      quantity: Number(this.jodiForm.value.jodiQuantity),

      pentDetails: {
        pentL: this.jodiForm.value.pentL,
        pentK: this.jodiForm.value.pentK,
        shi: this.jodiForm.value.shi,
        mo: this.jodiForm.value.mo,
        ja: this.jodiForm.value.ja,
        jo: this.jodiForm.value.jo,
        go: this.jodiForm.value.go,
        pentPatterns: this.selectedPentPatterns,
        pentAdditionalDesc: this.jodiForm.value.pentAdditionalDesc,
        pentTotalExtraCost: Number(this.jodiForm.value.pentTotalExtraCost),
        quantity: Number(this.jodiForm.value.pentQuantity),
      },

      shirtDetails: {
        shirtL: this.jodiForm.value.shirtL,
        ba: this.jodiForm.value.ba,
        cha: this.jodiForm.value.cha,
        sho1: this.jodiForm.value.sho1,
        sho2: this.jodiForm.value.sho2,
        sho3: this.jodiForm.value.sho3,
        pe1: this.jodiForm.value.pe1,
        pe2: this.jodiForm.value.pe2,
        pe3: this.jodiForm.value.pe3,
        pe4: this.jodiForm.value.pe4,
        ko: this.jodiForm.value.ko,
        shirtK: this.jodiForm.value.shirtK,
        kh: this.jodiForm.value.kh,
        shirtPatterns: this.selectedShirtPatterns,
        shirtAdditionalDesc: this.jodiForm.value.shirtAdditionalDesc,
        shirtTotalExtraCost: Number(this.jodiForm.value.shirtTotalExtraCost),
        shirtType: this.jodiForm.value.shirtType,
        quantity: Number(this.jodiForm.value.shirtQuantity)
      },
    }

    if (!this.orderId) {
      this.firebaseService.addOrderMaster(payload).then(res => {
        if (res) {
          this.jodiForm.reset();
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            icon: 'success',
            timerProgressBar:true,
            timer: 5000,
            title: 'Order Created Successfully'
          })
        }
      })
    } else {
      this.firebaseService.updateOrderMaster(this.orderId, payload).then((res: any) => {
        this.jodiForm.reset();
        Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: 'success',
          timerProgressBar:true,
          timer: 5000,
          title: 'Order Update Successfully'
        })
      })
    }

  }

  editOrder(value: any): void {
    this.orderData = value
    this.orderId = value.id
    this.setOrderData(value)
  }

  setOrderData(value: any) {
    this.searchCustomer = value.customerMobileNo;
    this.fullName = value.customerName
    this.mobileNo = value.customerMobileNo
    this.customerId = value.customerId
    this.jodiForm.controls['jodiQuantity'].setValue(Number(value?.quantity))
    this.jodiForm.controls['garmentType'].setValue(value?.garmentType)
    this.jodiForm.controls['pentQuantity'].setValue(Number(value?.pentDetails?.quantity))
    this.jodiForm.controls['pentL'].setValue(value?.pentDetails?.pentL)
    this.jodiForm.controls['pentK'].setValue(value?.pentDetails?.pentK)
    this.jodiForm.controls['shi'].setValue(value?.pentDetails?.shi)
    this.jodiForm.controls['mo'].setValue(value?.pentDetails?.mo)
    this.jodiForm.controls['ja'].setValue(value?.pentDetails?.ja)
    this.jodiForm.controls['jo'].setValue(value?.pentDetails?.jo)
    this.jodiForm.controls['go'].setValue(value?.pentDetails?.go)
    this.jodiForm.controls['pentPatterns'].setValue(value?.pentDetails?.pentPatterns)
    this.jodiForm.controls['pentAdditionalDesc'].setValue(value?.pentDetails?.pentAdditionalDesc)
    this.jodiForm.controls['pentTotalExtraCost'].setValue(value?.pentDetails?.pentTotalExtraCost)
    this.jodiForm.controls['shirtQuantity'].setValue(Number(value?.shirtDetails?.quantity))
    this.jodiForm.controls['shirtL'].setValue(value?.shirtDetails?.shirtL)
    this.jodiForm.controls['ba'].setValue(value?.shirtDetails?.ba)
    this.jodiForm.controls['cha'].setValue(value?.shirtDetails?.cha)
    this.jodiForm.controls['sho1'].setValue(value?.shirtDetails?.sho1)
    this.jodiForm.controls['sho2'].setValue(value?.shirtDetails?.sho2)
    this.jodiForm.controls['sho3'].setValue(value?.shirtDetails?.sho3)
    this.jodiForm.controls['pe1'].setValue(value?.shirtDetails?.pe1)
    this.jodiForm.controls['pe2'].setValue(value?.shirtDetails?.pe2)
    this.jodiForm.controls['pe3'].setValue(value?.shirtDetails?.pe3)
    this.jodiForm.controls['pe4'].setValue(value?.shirtDetails?.pe4)
    this.jodiForm.controls['ko'].setValue(value?.shirtDetails?.ko)
    this.jodiForm.controls['shirtK'].setValue(value?.shirtDetails?.shirtK)
    this.jodiForm.controls['kh'].setValue(value?.shirtDetails?.kh)
    this.jodiForm.controls['shirtPatterns'].setValue(value?.shirtDetails?.shirtPatterns)
    this.jodiForm.controls['shirtAdditionalDesc'].setValue(value?.shirtDetails?.shirtAdditionalDesc)
    this.jodiForm.controls['shirtTotalExtraCost'].setValue(value?.shirtDetails?.shirtTotalExtraCost)
    this.jodiForm.controls['deliveryDate'].setValue(new Date(value?.deliveryDate))
    this.jodiForm.controls['shirtType'].setValue(value?.shirtDetails?.shirtType)
  }

  deletebutton(){
    alert("Delete Data")
  }

  archive(){
    alert("Archive Data")
  }
}
