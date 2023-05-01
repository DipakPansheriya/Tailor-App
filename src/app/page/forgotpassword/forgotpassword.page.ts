import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  emailId:any =''
  constructor( private authService:AuthService ,private router:Router) { }

  ngOnInit() {
  }

  forgotPassword(){
    this.authService.forgotPassword(this.emailId).subscribe((res:any)=>{
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: 'success',
        timerProgressBar:true,
        timer: 9000,
        title: 'Please Check Your Email '
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
