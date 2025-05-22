import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../environments/environment';
import { UserResponse } from '../responses/user/user.response';
// import { LoginResponseM } from '../dtos/user/loginResponse.dto';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiRegister = `${environment.appBaseUrl}/user`;
  private apiLogin = `${environment.appBaseUrl}/auth/token`;
  private apiUserDetail = `${environment.appBaseUrl}/auth/details`;

  private apiConfig = {
    headers: this.createHeaders(),
  }

  constructor(private http: HttpClient) { }
  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi'
    });
  }
  register(registerDTO: RegisterDTO): Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig)
  }
  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig)
  }
  getUserDetail(token: string) {
    return this.http.post(this.apiUserDetail, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  getUsers(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiRegister}?page=${page}&limit=${limit}`);
  }
  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      if (userResponse == null || !userResponse) {
        return;
      }
      // Chuyển đổi đối tượng phản hồi người dùng thành một chuỗi JSON
      const userResponseJSON = JSON.stringify(userResponse);

      // Lưu chuỗi JSON vào bộ nhớ cục bộ với một khóa (ví dụ: "userResponse")
      localStorage.setItem('user', userResponseJSON);

      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }

  getUserResponseToLocalStorage(): UserResponse | null {
    try {
      const userResponseJSON = localStorage.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }

      const userResponse = JSON.parse(userResponseJSON!);

      console.log('User response saved to local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
      return null;
    }
  }
  removeUserFromLocalStorage(): void {
    try {
      localStorage.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
    }
  }
  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post<any>(`${environment.appBaseUrl}/auth/google-login`, { idToken });
  }


}
