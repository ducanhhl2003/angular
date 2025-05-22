import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent], // Chỉ import RouterOutlet thay vì RouterModule.forRoot([])
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

}
