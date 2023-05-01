import { Injectable } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { CustomerList } from '../interface/invoice';
import { Firestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private fService: Firestore) { }


    /////////////////////// Party List Data ////////////////////////


  // add new data code here
  addData(data: CustomerList) {
    data.id = doc(collection(this.fService, 'id')).id
    return addDoc(collection(this.fService, 'CustomerList'), data)
  }

  // get all data from Invoicebase
  getAllData() {
    let dataRef = collection(this.fService, 'CustomerList' )
    return collectionData(dataRef, { idField: 'id' })
  }

  // Delete all data from Invoicebase
  deleteData(data: CustomerList) {
    let docRef = doc(collection(this.fService, 'CustomerList' ), data.id);
    return deleteDoc(docRef)
  }

  // Update Invoice from Invoice base
  updateData(data: CustomerList, CustomerList: any) {
    let dataRef = doc(this.fService, `CustomerList/${data}` );
    return updateDoc(dataRef, CustomerList)
  }

}