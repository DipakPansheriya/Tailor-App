import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit , OnDestroy {

  networkListener : PluginListenerHandle
  status : boolean
  openPageLogo = true

  constructor( private ngZone:NgZone) { }

  async ngOnInit() {
    


    this.networkListener = await Network.addListener('networkStatusChange', status => {
      this.ngZone.run(() => {
        this.changeStatus(status)
      })
    });
    
    const status = await Network.getStatus();

    this.changeStatus(status)

    setTimeout(() => {
      this.openPageLogo =false
    }, 2000);
  }
  changeStatus(status :any){
    this.status = status?.connected
  }

  ngOnDestroy(): void {
    if(this.networkListener) this.networkListener.remove();
  }
}
