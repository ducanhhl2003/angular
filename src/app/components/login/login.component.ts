import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../responses/user/login.response';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
// import { LoginResponseM } from '../../dtos/user/loginResponse.dto';
import { Role } from '../../models/role';

declare const google: any; // Khai báo Google SDK

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  username: string;
  password: string;
  rememberMe: boolean = true;
  userReponse?: UserResponse;


  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {
    this.username = 'test1';
    this.password = '123456';
  }

  ngOnInit() {
    // Khởi tạo Google Sign-In
    debugger
    (window as any).handleCredentialResponse = (response: any) => {
      console.log('Google Token:', response.credential);
      this.loginWithGoogle(response.credential); // Đúng với backend nhận idToken
    };


    google.accounts.id.initialize({
      client_id: '508694954488-i7uj9809d0431s85bsd14rs7pno1mg8v.apps.googleusercontent.com', // Thay bằng Client ID từ Google Cloud
      callback: (window as any).handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large' }
    );
  }

  login() {
    if (!this.username?.trim() || !this.password?.trim()) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    const loginDTO: LoginDTO = {
      username: this.username.trim(),
      password: this.password.trim(),
    };

    console.log("Dữ liệu gửi lên API:", loginDTO);

    this.userService.login(loginDTO).subscribe(
      (response: LoginResponse) => {
        console.log("Đăng nhập thành công:", response);
        alert("Đăng nhập thành công!");

        const token = response?.result?.token;
        if (!token) {
          alert("Lỗi: Không nhận được token từ server.");
          return;
        }

        this.tokenService.setToken(token);



        this.userService.getUserDetail(token).subscribe({
          next: (userResponse: any) => {
            console.log("Thông tin người dùng:", userResponse);
            this.userReponse = { ...userResponse };
            this.userService.saveUserResponseToLocalStorage(this.userReponse);

            this.redirectUser();

          },
          error: (error: any) => {
            console.error("Lỗi lấy thông tin user:", error);
            alert(error.error.message);
          }
        });

      },
      (error: any) => {
        console.error("Lỗi đăng nhập:", error);
        alert(`Lỗi: ${error.error.message}\nChi tiết: ${JSON.stringify(error.error.data)}`);
      }
    );
  }
  loginWithGoogle(idToken: string) {
    this.userService.loginWithGoogle(idToken).subscribe(
      (response: any) => {
        console.log("Google Login Response:", response);
        alert("Đăng nhập bằng Google thành công!");

        const jwtToken = response?.token;
        if (!jwtToken) {
          alert("Lỗi: Không nhận được token từ server.");
          return;
        }

        console.log('token:', jwtToken);
        this.tokenService.setToken(jwtToken);

        // Lấy ID người dùng từ trường 'sub' trong phản hồi Google
        const userId = response?.id || response?.sub || 'default-id'; // Nếu không có id, lấy từ 'sub'

        // Lưu thông tin user từ Google, sử dụng userId động
        this.userReponse = {
          id: userId,  // Lấy id từ 'sub' hoặc 'id' trong phản hồi
          phone: 0,
          address: '',
          fullName: response?.name || '',  // Lấy tên từ phản hồi
          userName: response?.email,       // Lấy email làm username
          email: response?.email,
          roleName: "user",                // Mặc định role là "user"
          roles: { id: 0, roleName: "USER" } // Lưu thông tin role
        };

        this.userService.saveUserResponseToLocalStorage(this.userReponse);
        this.redirectUser();
      },
      (error: any) => {
        console.error("Lỗi đăng nhập bằng Google:", error);
        alert("Lỗi đăng nhập bằng Google!");
      }
    );
  }

  // loginWithGoogle(idToken: string) {
  //   this.userService.loginWithGoogle(idToken).subscribe(
  //     (response: any) => {
  //       console.log("Google Login Response:", response);
  //       alert("Đăng nhập bằng Google thành công!");

  //       const jwtToken = response?.token;
  //       if (!jwtToken) {
  //         alert("Lỗi: Không nhận được token từ server.");
  //         return;
  //       }

  //       console.log('token:', jwtToken);
  //       this.tokenService.setToken(jwtToken);

  //       // Lấy ID người dùng từ trường 'sub' trong phản hồi Google
  //       const userId = response?.sub || 'default-id'; // Dùng 'sub' làm ID người dùng

  //       // Lưu thông tin user từ Google, sử dụng userId động
  //       this.userReponse = {
  //         id: userId,  // Lấy id từ 'sub'
  //         phone: 0,
  //         address: '',
  //         fullName: response?.name || '',  // Lấy tên từ phản hồi
  //         userName: response?.email,       // Lấy email làm username
  //         email: response?.email,
  //         roleName: "user",                // Mặc định role là "user"
  //         roles: { id: 0, roleName: "USER" } // Lưu thông tin role
  //       };

  //       this.userService.saveUserResponseToLocalStorage(this.userReponse);
  //       this.redirectUser();
  //     },
  //     (error: any) => {
  //       console.error("Lỗi đăng nhập bằng Google:", error);
  //       alert("Lỗi đăng nhập bằng Google!");
  //     }
  //   );
  // }


  // loginWithGoogle(idToken: string) {
  //   this.userService.loginWithGoogle(idToken).subscribe(
  //     (response: any) => {
  //       console.log("Google Login Response:", response);
  //       alert("Đăng nhập bằng Google thành công!");

  //       const jwtToken = response?.token;
  //       if (!jwtToken) {
  //         alert("Lỗi: Không nhận được token từ server.");
  //         return;
  //       }

  //       console.log('token:', jwtToken);
  //       this.tokenService.setToken(jwtToken);

  //       const defaultRole: Role = {
  //         id: 0,  // Hoặc ID mặc định nếu cần
  //         roleName: "USER", // Mặc định role là "USER"
  //       };
  //       // Lưu thông tin user từ Google
  //       this.userReponse = {
  //         id: 0, // ID chưa có từ Google
  //         phone: 0,
  //         address: '',
  //         fullName: '',
  //         userName: response.email, // Lấy email làm username
  //         email: response.email,
  //         roleName: "user", // Mặc định role "user"
  //         roles: { id: 0, roleName: "USER" }
  //       };

  //       this.userService.saveUserResponseToLocalStorage(this.userReponse);
  //       this.redirectUser();
  //     },
  //     (error: any) => {
  //       console.error("Lỗi đăng nhập bằng Google:", error);
  //       alert("Lỗi đăng nhập bằng Google!");
  //     }
  //   );
  // }



  redirectUser() {
    if (this.userReponse?.roleName == 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
