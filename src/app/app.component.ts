import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { filter, pairwise } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { FirebaseService } from './service/firebase.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  networkListener : PluginListenerHandle
  status : boolean
  currentUrl :any = '/'
  userToken:any
  isLoginDisplay:boolean = false

  constructor( private ngZone:NgZone, private router:Router , private cookieService: CookieService ,private firebaseService: FirebaseService) { 
    this.router.events.pipe(filter((evt:any)=> evt instanceof RoutesRecognized), pairwise()).subscribe((event:RoutesRecognized[])=>{
      console.log('Current Url===>',event[1].urlAfterRedirects);
      this.currentUrl = event[1].urlAfterRedirects
      if(this.currentUrl === '/'){
        App.addListener("backButton" ,() => {
          App.exitApp();
        })
      }
    })
  }

  async ngOnInit() {
    if(this.currentUrl !== 'register' || this.currentUrl !== 'forgotpassword'){
      this.getToken()
    }


    // const cookieValue = this.cookieService.get('userId');
    // this.firebaseService.getAllUserData().subscribe((res:any) => {
    //   if(res){
    //     const data = res.find((id:any) => id.id === cookieValue )
    //     if(data){
    //       this.router.navigate(['/tabs/tab1'])
    //     } else {
    //       this.router.navigate(['/login'])
    //     }
    //   }

    // })


      this.networkListener = await Network.addListener('networkStatusChange', status => {
        this.ngZone.run(() => {
          this.changeStatus(status)
        })
      });
    const status = await Network.getStatus();
    this.changeStatus(status)

  }

  async getToken() {
    const ret:any = await Storage.get({ key: 'authtoken' });
    this.userToken = JSON.parse(ret.value);
    if(this.userToken?.token) {
      this.router.navigate(['/tabs/tab1'])
    } else {
      this.router.navigate(['/login'])
      
    }
  }

  changeStatus(status :any){
    this.status = status?.connected
  }

  ngOnDestroy(): void {
    if(this.networkListener) this.networkListener.remove();
  }
}
