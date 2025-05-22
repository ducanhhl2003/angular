import { Component, OnInit } from '@angular/core';

declare const google: any; // Khai báo Google object

@Component({
  selector: 'app-google',
  template: `
    <div id="g_id_onload"
         data-client_id="508694954488-i7uj9809d0431s85bsd14rs7pno1mg8v.apps.googleusercontent.com"
         data-callback="handleCredentialResponse"
         data-auto_prompt="false">
    </div>
    <div class="g_id_signin" data-type="standard"></div>
  `,
  styles: []
})
export class GoogleComponent implements OnInit {

  ngOnInit() {
    // Xử lý response từ Google Sign-In
    (window as any).handleCredentialResponse = (response: any) => {
      console.log('Google Token:', response.credential);
      this.sendTokenToBackend(response.credential);
    };
  }

  sendTokenToBackend(token: string) {
    // Gửi token đến backend Spring Boot
    fetch('http://localhost:8080/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(response => response.json())
      .then(data => console.log('Backend Response:', data))
      .catch(error => console.error('Error:', error));
  }
}
