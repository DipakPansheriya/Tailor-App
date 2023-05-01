import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  emailId : any
  password:any

  constructor( private router:Router , private authService:AuthService) { }

  ngOnInit() {
  }

  login(){
    this.authService.signIn(this.emailId,this.password).subscribe((res:any)=>{
     
      this.router.navigate(['/tabs/tab1'])
    }, (error) => {
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: 'error',
        timerProgressBar:true,
        timer: 5000,
        title: error.error.error.message
      })
    })
  }

  googleLogin(){
    this.authService.googleSignIn();
  }
  }
