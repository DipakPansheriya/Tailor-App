import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  userToken:any
  constructor(private router:Router) {}

  ngOnInit(): void {
    // this.getToken()
  }

  
  async getToken() {
    const ret:any = await Storage.get({ key: 'authtoken' });
    this.userToken = JSON.parse(ret.value);
    if(this.userToken?.token) {
      this.router.navigate(['/tabs/tab1'])
    } else {
      debugger
      this.router.navigate(['/login'])
      
    }
  }


}
