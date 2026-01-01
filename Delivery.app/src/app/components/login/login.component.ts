import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private service: LoginService, private router: Router) { }


  usuario: any;
  clave: any;
  mensaje: any;
  dataSourceLogin: any;

  ngOnInit(): void {

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem("user_state");
    }
  }
  Login() {
    let obj = {
      "Usuario": this.usuario,
      "Clave": btoa(this.clave)
    }
    this.service.Login(obj).subscribe(x => {
      console.log(x);
      this.dataSourceLogin = x;
      if (this.dataSourceLogin.result == true) {
        localStorage.setItem("user_state", "true");
        localStorage.setItem("user_email", this.usuario);
        this.router.navigate(['/home/productos']);
      } else {
        this.mensaje = this.dataSourceLogin.mensaje;
        //console.error(this.dataSourceLogin.mensaje);
        //alert(this.dataSourceLogin.mensaje);
      }

    })
  }
}
