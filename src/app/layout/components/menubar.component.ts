import { NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { FileApp } from '@models/File';
import { CustomUsuario, Usuario } from '@models/Usuario';
import { AlertService } from '@utils/services/alert.service';
import { FileService } from '@utils/services/file.service';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputComponent } from "../../shared/input.component";

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [
    MenubarModule, AvatarModule,
    DynamicDialogModule, MenuModule, DialogModule,
    InputComponent, ReactiveFormsModule, NgStyle,
    ProgressBarModule, NgIf
  ],
  template: `
    <section class="w-full h-full flex-column justify-content-center align-items-center flex">
      <p-menubar [model]="items">
        <ng-template pTemplate="end">
          <p-menu #menu [model]="itemsPopup" [popup]="true" />
          <div (click)="menu.toggle($event)" (keydown.enter)="menu.toggle($event)"
            class="flex cursor-pointer align-items-center ml-2 gap-2" tabindex="0" role="button"
            aria-label="Menu de perfil">
            <p-avatar
              [image]="user?.profilePhoto? user?.profilePhoto: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png'"
              shape="circle" />
            <i class="default bi bi-chevron-down"></i>
          </div>
        </ng-template>
      </p-menubar>
      <p-dialog [modal]="true" header="Edit Profile" [(visible)]="visible" [style]="{ width: '25rem' }">
        <ng-template pTemplate="header">
          <div class="inline-flex align-items-center justify-content-center gap-2">
            <span class="font-bold white-space-nowrap">
              {{user?.name}}
            </span>
          </div>
        </ng-template>
        <section class="w-full modal_usr flex align-items-center justify-content-center">
          <input (change)="onFileChange($event)" hidden accept="image/*" type="file" #fileInput>
          <section class="foto">
            <section class="img h-7rem w-7rem" [ngStyle]="{'background-image': 'url(' + (imagePreview() || '') + ')', 
              'background-size': 'cover', 'background-position': 'center'}">
                <section *ngIf="value === 0" 
                  tabindex="0" 
                  (click)="fileInput.click()" 
                  (keydown.enter)="fileInput.click()" 
                  (keydown.space)="fileInput.click()" 
                  class="w-full hidden edit_photo justify-content-center align-items-center h-full">
                  <i class="bi text-orange-500 text-xl bi-pencil"></i>
                </section>
              <section *ngIf="value > 0" class="w-full flex loading justify-content-center align-items-center h-full">
                <section class="w-5rem">                  
                  <p-progressBar [value]="value" />
                </section>
              </section>
            </section>
          </section>
        </section>
        <form [formGroup]="form">
          <section class="w-full h-full flex flex-column gap-3">
            <app-input label="Nome" formControlName="name" type="text" />
            <app-input label="Email" formControlName="email" type="email" />
            <app-input label="Telefone" formControlName="phone" type="text" />
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
    .modal_usr .edit_photo,
    .modal_usr .loading {
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: grayscale(.8);
      -webkit-backdrop-filter: grayscale(.8);
      cursor: pointer;    
    }
    .modal_usr .img{
      border-radius: 50%;
      overflow: hidden;
    }
    .modal_usr .img:hover .edit_photo{
      display: flex !important;
    }
    .modal_usr .img:hover{
      border: 2px dashed var(--orange-500);
    }
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
  providers: [AuthService, DialogService, FileService],
  encapsulation: ViewEncapsulation.None
})
export class MenuBarComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  private alert = inject(AlertService);
  private fileService = inject(FileService)
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  ref: DynamicDialogRef | undefined;
  items: MenuItem[] | undefined;
  itemsPopup: MenuItem[] | undefined;
  user: CustomUsuario | null = null;

  visible: boolean = false;
  imagePreview = signal('');
  selectedFile: File | null = null;
  value: number = 0;

  form: FormGroup = new FormGroup({
    email: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null)
  })

  ngOnInit(): void {
    this.setItems();
    this.setItemsPopup();
    this.loadUser();
  }
  private loadUser() {
    const usr = this.auth.getUserFromSessionStorage();
    if (usr) {
      this.user = new CustomUsuario(usr);
    }
    if (this.user) {
      this.form.patchValue(this.user);
      if (this.user.profilePhoto) {
        this.imagePreview.set(this.user.profilePhoto);
      }
    }
  }
  saveProfile() {

  }

  onFileChange(event: Event): void {
    this.value = 30;
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0] || null;
    this.uploadFile(file);
  }

  uploadFile(file: File | null): void {
    this.value = 50;
    if (file && file.type.startsWith('image/')) {
      this.value = 70;
      this.fileService.createFile(this.user!.id, file)
        .subscribe((p: FileApp) => {
          this.value = 80;
          if (p) {
            this.value = 90;
            const usr = this.auth.getUserFromSessionStorage();
            if (usr) {
              const usrN = new Usuario(usr);
              usrN.profilePhoto = p;
              this.auth.setUserInSessionStorage(usrN);
              this.value = 100;
            }
            this.loadUser();
            this.alert.showMsg('success', 'Foto de perfil', 'atualizada com sucesso');
            this.value = 0;
          }
        })
      // this.selectedFile = file;
      // const reader = new FileReader();
      // this.value = 70;
      // setTimeout(() => {
      //   this.value = 100;
      //   reader.onload = () => {
      //     this.imagePreview.set(reader.result as string);
      //   }
      //   reader.readAsDataURL(file);
      //   this.value = 0;
      // }, 1000)
    }
  }

  private navigate(rota: string) {
    this.router.navigate([rota]);
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
      { label: 'Meu perfil', icon: 'bi bi-person-circle', command: () => { this.visible = true; this.value = 0 } },
      { label: 'Sair', icon: 'bi bi-box-arrow-left', command: () => { this.auth.logout() } }
    ]
  }
}