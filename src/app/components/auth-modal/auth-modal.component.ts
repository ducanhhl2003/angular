import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  userName: string;
  passWord: string;
  retypePassword: string;

  constructor(private router: Router, private userService: UserService) {
    this.userName = '';
    this.passWord = '';
    this.retypePassword = '';
  }

  register() {
    if (!this.userName?.trim() || !this.passWord?.trim()) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    if (this.passWord !== this.retypePassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    const registerDTO = {
      userName: this.userName.trim(),
      passWord: this.passWord.trim(),
      retypePassword: this.retypePassword.trim()
    };

    console.log("Dữ liệu gửi lên API:", registerDTO); // Log để kiểm tra dữ liệu gửi đi


    this.userService.register(registerDTO).subscribe(
      (response: any) => {
        console.log("Đăng ký thành công:", response);
        alert("Đăng ký thành công!");
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error("Lỗi đăng ký:", error);
        alert(`Lỗi: ${error.error.message}\nChi tiết: ${JSON.stringify(error.error.data)}`);
      }
    );
  }


  checkPasswordsMatch() {
    if (this.passWord !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword'].setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }
}
