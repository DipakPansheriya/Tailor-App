import { Component, OnInit, ViewChild } from '@angular/core';
import { AnimationController, IonModal } from '@ionic/angular';
import { FirebaseService } from '../service/firebase.service';
import { CustomerList } from '../interface/invoice';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;


  message = '';
  firstName: any;
  lastName: any;
  mobileNo: any;
  customerData: any = []
  isModalOpen = false;
  isModalOpenEdit = false;
  customerId: any
  isLoader = false

  private regexPettern: RegExp = new RegExp(/^\d{0,10}$/g);
  // private regexPettern: RegExp = new RegExp(/^\d$/g);
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

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.isLoader = true
    this.getAllData()
  }

  confirm() {
    if (this.mobileNo && this.lastName && this.firstName) {
      const payload: CustomerList = {
        id: this.customerId ? this.customerId : '',
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNo: Number(this.mobileNo)
      }
      if (!this.customerId) {
        this.firebaseService.addData(payload).then((res) => {
          this.getAllData()
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            icon: 'success',
            timerProgressBar:true,
            timer: 5000,
            title: 'Customer Created Successfully'
          })
        }
        )
      } else {
        this.firebaseService.updateData(this.customerId, payload).then(res => {
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            icon: 'success',
            timerProgressBar:true,
            timer: 5000,
            title: 'Customer Update Successfully'
          })
        })
      }
    }
    this.isModalOpen = false
    this.isModalOpenEdit = false
  }

  getAllData() {
    this.firebaseService.getAllData().subscribe((res: any) => {
      if (res) {
        this.customerData = res
        this.isLoader = false
      }
    })
  }

  setOpenEdit(isOpen: boolean) {
    this.isModalOpenEdit = isOpen;
    this.firstName = ''
    this.lastName = ''
    this.mobileNo = ''

  }


  setOpen(isOpen: boolean, item: any) {
    this.isModalOpen = isOpen;
    this.customerId = item.id
    this.firstName = item.firstName
    this.lastName = item.lastName
    this.mobileNo = item.mobileNo
  }

  decimalInputRestriction(event:any): any {
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
    if (next && !String(next).match(this.regexPettern)) {
      event.preventDefault();
    }


  }
}

