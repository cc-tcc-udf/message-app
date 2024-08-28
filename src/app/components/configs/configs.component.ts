import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-configs',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './configs.component.html',
  styleUrl: './configs.component.scss',
})
export class ConfigsComponent { }
