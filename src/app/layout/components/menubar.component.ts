import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { CustomUsuario } from '@models/Usuario';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { Subscription } from 'rxjs';
import { InputComponent } from "../../shared/input.component";


@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [
    MenubarModule, AvatarModule,
    DynamicDialogModule, MenuModule, DialogModule,
    InputComponent, ReactiveFormsModule
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
            <p-avatar [image]="user$?.profilePhoto? user$?.profilePhoto: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png'" shape="circle" />
            <i class="default bi bi-chevron-down"></i>
          </div>
        </ng-template>
      </p-menubar>
      <p-dialog [modal]="true" header="Edit Profile" [(visible)]="visible" [style]="{ width: '25rem' }">
        <ng-template pTemplate="header">
          <div class="inline-flex align-items-center justify-content-center gap-2">
              <p-avatar [image]="user$?.profilePhoto? user$?.profilePhoto: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png'" shape="circle" />
                <span class="font-bold white-space-nowrap">
                    {{user$?.name}}
                </span>
            </div>
        </ng-template>
        <form [formGroup]="form" >
            <section class="w-full h-full flex flex-column gap-3">                      
            <app-input label="Nome" formControlName="name" type="text"/>
            <app-input label="Email" formControlName="email" type="email"/>       
            <app-input label="Telefone" formControlName="phone" type="text"/>       
          </section>
          </form>
        <ng-template pTemplate="footer">
          <section class="flex justify-content-end">
            <button class="add default">Salvar</button>
          </section>
        </ng-template>
      </p-dialog>
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
export class MenuBarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private auth = inject(AuthService);
  private dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;
  items: MenuItem[] | undefined;
  itemsPopup: MenuItem[] | undefined;
  visible: boolean = false;
  user$!: CustomUsuario | null;
  private userSubscription: Subscription | undefined;

  form: FormGroup = new FormGroup({
    email: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null)
  })

  ngOnInit(): void {
    this.auth.initUser()
    this.setItems();
    this.setItemsPopup();
    this.getData();
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
  getData() {
    this.userSubscription = this.auth.user$.subscribe(user => {
      if (user)
        this.user$ = new CustomUsuario(user);
    });
  }

  openModal() {
    // this.ref = this.dialogService.open(
    //   ModalUserComponent, {
    //   position: 'bottom',
    //   width: '40vw',
    //   header: this.user$?.name,
    //   modal: true,
    //   contentStyle: { overflow: 'auto' },
    //   data: {
    //     user: this.user$
    //   }

    // }
    // )
    this.visible = true;
  }

  private navigate(rota: string) {
    this.router.navigate([rota]);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
