import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { ModalUserComponent } from '@components/users/components/modal-user.component';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [
    MenubarModule, AvatarModule,
    DynamicDialogModule, MenuModule
  ],
  template: `
    <section class="w-full h-full flex-column justify-content-center align-items-center flex">
      <p-menubar [model]="items">
        <ng-template pTemplate="end">
        <p-menu #menu [model]="itemsPopup" [popup]="true" />
        <div 
            (click)="menu.toggle($event)" 
            (keydown.enter)="menu.toggle($event)"
            class="flex cursor-pointer align-items-center ml-2 gap-2" 
            tabindex="0" 
            role="button" 
            aria-label="Menu de perfil">
          <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" shape="circle" />
          <i class="default bi bi-chevron-down"></i>
          </div>
        </ng-template>
      </p-menubar>
    </section>
  `,
  styles: [`
    .p-menubar {
      padding: 0.5rem;
      background: none;
      color: #4b5563;
      border: none;
      border-radius: 6px;
    }
    
    .p-menubar .p-submenu-list {
      width: max-content;
    }
  `],
  providers: [AuthService, DialogService],
  encapsulation: ViewEncapsulation.None
})
export class MenuBarComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  private dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;
  items: MenuItem[] | undefined;
  itemsPopup: MenuItem[] | undefined;

  ngOnInit(): void {
    this.setItems();
    this.setItemsPopup();
  }
  setItems() {
    this.items = [
      { label: 'Home', icon: 'bi bi-house', command: () => { this.navigate('home') } },
      {
        label: 'Mensagem', icon: 'bi bi-chat-square-text-fill',
        items: [
          { label: 'Mensagens', icon: 'bi bi-card-list', command: () => { this.navigate('msg') } },
        ]
      },
      { label: 'Configurações', icon: 'bi bi-sliders', command: () => { this.navigate('configs') } },
    ]
  }
  setItemsPopup() {
    this.itemsPopup = [
      { label: 'Meu perfil', icon: 'bi bi-person-circle', command: () => { this.openModal() } },
      { label: 'Sair', icon: 'bi bi-box-arrow-left', command: () => { this.auth.logout() } }
    ]
  }

  openModal() {
    this.ref = this.dialogService.open(
      ModalUserComponent, {
      position: 'bottom',
      width: '40vw',
      contentStyle: { overflow: 'auto' },
    }
    )
  }

  private navigate(rota: string) {
    this.router.navigate([rota]);
  }

}
