import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { filter, pairwise } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  networkListener : PluginListenerHandle
  status : boolean
  currentUrl :any = '/'

  constructor( private ngZone:NgZone, private router:Router) { 
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
   
      this.networkListener = await Network.addListener('networkStatusChange', status => {
        this.ngZone.run(() => {
          this.changeStatus(status)
        })
      });
    const status = await Network.getStatus();
    this.changeStatus(status)

  }

  changeStatus(status :any){
    this.status = status?.connected
  }

  ngOnDestroy(): void {
    if(this.networkListener) this.networkListener.remove();
  }
}
