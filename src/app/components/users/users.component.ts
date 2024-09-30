import { NgClass, NgFor, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { GenericResponse } from '@models/GenericResponse';
import { CustomUsuario, Usuario } from '@models/Usuario';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ModalUserComponent } from './components/modal/modal-user.component';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ScrollPanelModule, NgFor,
    NgStyle, NgClass
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [DialogService],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  private service = inject(UsersService);
  private dialog = inject(DialogService);
  private cr = inject(ChangeDetectorRef);

  ref: DynamicDialogRef | undefined;
  users: CustomUsuario[] = [];

  ngOnInit(): void {
    this.service.getUsers()
      .subscribe((usrs: GenericResponse) => {
        if (usrs.success) {
          this.users = (usrs.data as Usuario[])
            .map(user => new CustomUsuario(user));
          this.cr.detectChanges();
        }
      });
  }

  openModal(user?: CustomUsuario) {
    this.ref = this.dialog.open(ModalUserComponent, {
      header: 'User',
      width: '30vw',
      height: 'auto',
      modal: true,
      breakpoints: {
        '1366px': '40vw',
        '992px': '50vw',
        '768px': '70vw',
        '640px': '90vw'
      },
      data: {
        user: user
      },
      draggable: true
    })
    this.ref.onClose.subscribe(result => {
      if (result) {
        this.users.push(new CustomUsuario(result));
      }
    });
  }
}
