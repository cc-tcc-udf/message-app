import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private service = inject(UsersService);

  ngOnInit(): void {
    this.service.getUsers().subscribe(users => console.log(users));
  }
}
