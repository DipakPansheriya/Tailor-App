import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor( private authService:AuthService , private router :Router) { }
  email :any = ''
  password :any = ''
  
  ngOnInit() {
  }

  singUp(){
    const email = this.email 
    const password = this.password
    this.authService.signUp(email,password).subscribe((res:any)=>{
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: 'success',
        timerProgressBar:true,
        timer: 5000,
        title: 'Account Created Successfully'
      })
      // this.router.navigate(['/login'])
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
}
