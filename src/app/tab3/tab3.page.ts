import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import styler, { Styler } from 'stylefire';
import { animate as PopmotionAnimate } from 'popmotion';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('dynamicIsland') dynamicIsland: ElementRef | any;
  dynamicIslandIsOpen = false;
  public styler: Styler;
  private defaultDimensions:any; 
  isModalOpen = false;
  infotmation :any
  price :any
  selectedType :any


  constructor(private ngZone: NgZone) {}


  ngAfterViewInit(): void {
    // this.styler = styler(this.dynamicIsland.nativeElement);
    // this.defaultDimensions = {
    //   borderRadius: this.styler.get('borderRadius'),
    //   width: this.styler.get('width'),
    //   height: this.styler.get('height'),
    // }
  }

  // Update this 👇
  toggleDynamicIsland(): void {
    if (this.dynamicIslandIsOpen) {
      this.dynamicIslandIsOpen = false
      this.closeDynamicIsland().then(() => {
      })
    } else {
      this.openDynamicIsland().then(() => {
        this.dynamicIslandIsOpen = true
      })
    }
  }

  // Add this 👇
  openDynamicIsland(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.ngZone.runOutsideAngular(() => {
        PopmotionAnimate({
          from: JSON.stringify(this.defaultDimensions),
          to: JSON.stringify({ borderRadius: 25, width: 400, height: 150 }),
          duration: 600,
          type: 'spring',
          onUpdate: (latest:any) => {
            const latestFormatted = JSON.parse(latest);
            this.styler.set('borderRadius', `${latestFormatted.borderRadius}px`);
            this.styler.set('width', `${latestFormatted.width}px`);
            this.styler.set('height', `${latestFormatted.height}px`);
          },
          onComplete: () => {
            resolve();
          }
        });
      });
    })
  }

  // Add this 👇
  closeDynamicIsland(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.ngZone.runOutsideAngular(() => {
        PopmotionAnimate({
          from: JSON.stringify(
            {borderRadius: this.styler.get('borderRadius'),
            width: this.styler.get('width'),
            height: this.styler.get('height'),}
          ),
          to: JSON.stringify(this.defaultDimensions),
          duration: 600,
          type: 'spring',
          onUpdate: (latest:any) => {
            const latestFormatted = JSON.parse(latest);
            this.styler.set('borderRadius', `${latestFormatted.borderRadius}px`);
            this.styler.set('width', `${latestFormatted.width}px`);
            this.styler.set('height', `${latestFormatted.height}px`);
          },
          onComplete: () => {
            resolve();
          }
        });
      });
    })
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  handleChange(e:any) {
    this.selectedType = e.detail.value
  }
  
  submit(isOpen :any){
    const payload = {
      infotmation :this.infotmation,
      price :this.price,
      selectedType :this.selectedType
    }
    this.isModalOpen = isOpen;
    console.log("payload=========", payload);
    
  }
}
