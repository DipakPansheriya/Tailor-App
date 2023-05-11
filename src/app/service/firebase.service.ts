import { Injectable } from '@angular/core';
import { collectionData} from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { CustomerList, OrderMaster, Patterns, UserInfo } from '../interface/invoice';
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


  
  /////////////////////// Pattern List Data ////////////////////////


  // add new data code here
  addPattern(data: Patterns) {
    data.id = doc(collection(this.fService, 'id')).id
    return addDoc(collection(this.fService, 'Patterns'), data)
  }

  // get all data from Shirt Patterns
  getAllPatterns() {
    let dataRef = collection(this.fService, 'Patterns')
    return collectionData(dataRef, { idField: 'id' })
  }
  
  // Delete all data from Invoicebase
  deletePattern(data: Patterns) {
    let docRef = doc(collection(this.fService, 'Patterns'), data.id);
    return deleteDoc(docRef)
  }

  // Update Invoice from Invoice base
  updatePattern(data: Patterns, Patterns: any) {
    let dataRef = doc(this.fService, `Patterns/${data}`);
    return updateDoc(dataRef, Patterns)
  }

    /////////////////////// User Data ////////////////////////


  // add new data code here
  addUser(data: UserInfo) {
    data.id = doc(collection(this.fService, 'id')).id
    return addDoc(collection(this.fService, 'UserData'), data)
  }

  // get all data from Shirt Patterns
  getAllUserData() {
    let dataRef = collection(this.fService, 'UserData')
    return collectionData(dataRef, { idField: 'id' })
  }
    

    // ============= Order Data CRUD
    addOrderMaster(data: OrderMaster) {
      data.id = doc(collection(this.fService, 'id')).id
      return addDoc(collection(this.fService, 'OrderMaster'), data)
    }
  
    getAllOrderMaster() {
      let dataRef = collection(this.fService, 'OrderMaster')
      return collectionData(dataRef, { idField: 'id' })
    }
  
    updateOrderMaster(data: OrderMaster, OrderMaster: any) {
      let dataRef = doc(this.fService, `OrderMaster/${data}`);
      return updateDoc(dataRef, OrderMaster)
    }
  
}
