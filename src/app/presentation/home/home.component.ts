import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
}
