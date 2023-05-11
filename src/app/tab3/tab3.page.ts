import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import styler, { Styler } from 'stylefire';
import { animate as PopmotionAnimate } from 'popmotion';
import { FirebaseService } from '../service/firebase.service';
import { Patterns } from '../interface/invoice';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  @ViewChild('dynamicIsland') dynamicIsland: ElementRef | any;
  dynamicIslandIsOpen = false;
  public styler: Styler;
  private defaultDimensions:any; 
  isModalOpen = false;
  infotmation :any
  price :any
  selectedType :any
  patternId :any
  editData :any
  patternData :any = []
  isDelete :boolean
  


  constructor(private ngZone: NgZone , private firebaseService: FirebaseService) {}
  ngOnInit(): void {
    this.getAllData()
  }

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


  setOpen(isOpen: boolean , data:any) {
    this.isDelete = false
    this.isModalOpen = isOpen;
    this.infotmation = ''
    this.price = ''
    this.selectedType = ''
  }

  editDataOpen(isOpen: boolean , data:any) {
    this.isModalOpen = isOpen;
    this.infotmation = data.patternName
    this.price = data.patternPrice
    this.selectedType = data.patternCategory
    this.patternId = data.id
    this.editData = data
    this.isDelete = true
  }

  handleChange(e:any) {
    this.selectedType = e.detail.value
  }
  
  submit(isOpen :any){
    this.isModalOpen = isOpen;
    const payload : Patterns =  {
      id: this.patternId ? this.patternId :'',
      patternName: this.infotmation,
      patternPrice: this.price,
      patternCategory: this.selectedType
    }

    if(!this.patternId){
      this.firebaseService.addPattern(payload).then((res)=>{
         Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: 'success',
          timerProgressBar:true,
          timer: 5000,
          title: 'Pattern Created Successfully'
        })
      }) 
    }else{
      this.firebaseService.updatePattern(this.patternId ,payload).then((res)=>{
        Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: 'success',
          timerProgressBar:true,
          timer: 5000,
          title: 'Pattern Upade Successfully'
        })
      }) 
    }
  }

  getAllData(){
    this.firebaseService.getAllPatterns().subscribe(res => {
      if(res){
        this.patternData = res        
      }
    })
  }

  deleteData(){
    this.firebaseService.deletePattern(this.editData).then(res => {
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: 'success',
        timerProgressBar:true,
        timer: 5000,
        title: 'Pattern Delete Successfully'
      })
    })
    this.isModalOpen = false
  }
}
