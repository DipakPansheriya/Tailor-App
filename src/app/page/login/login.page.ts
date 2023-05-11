import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/service/auth.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import Swal from 'sweetalert2'
import { Storage } from '@capacitor/storage';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  emailId: any
  password: any

  constructor(private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private cookieService: CookieService) { }

  ngOnInit() {
  }

  login() {
    this.authService.signIn(this.emailId, this.password).subscribe((res: any) => {
      // this.firebaseService.getAllUserData().subscribe((userdata: any) => {
      //   if (userdata) {
      //     const userSetId = userdata.find((id: any) => id.userEmail === this.emailId)
      //     if (userSetId) {
        // this.setToken(userSetId.id)
      //     }
      //   }
      // })
      const userData = sessionStorage.getItem('UserData')
      debugger
      this.setToken(userData)
      this.router.navigate(['/tabs/tab1'])
    }, (error) => {
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: 'error',
        timerProgressBar: true,
        timer: 5000,
        title: error.error.error.message
      })
    })
  }

  async setToken(token:any) {
    console.log(token ,"token==============");
    
    await Storage.set({
      key: 'authtoken',
      value: JSON.stringify({
        token : token
      })
    });
  }

  googleLogin() {
    this.authService.googleSignIn();
  }
}
