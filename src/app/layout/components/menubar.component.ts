import { NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { FileApp } from '@models/File';
import { CustomUsuario, Usuario } from '@models/Usuario';
import { InputComponent } from '@shared/input.component';
import { AlertService } from '@utils/services/alert.service';
import { FileService } from '@utils/services/file.service';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ProgressBarModule } from 'primeng/progressbar';

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
      <p-menubar appendTo="body" [model]="items">
        <ng-template pTemplate="end">
          <p-menu appendTo="body" #menu [model]="itemsPopup" [popup]="true" />
          <div (click)="menu.toggle($event)" (keydown.enter)="menu.toggle($event)"
            class="flex cursor-pointer align-items-center ml-2 gap-2" tabindex="0" role="button"
            aria-label="Menu de perfil">
              <div class="shadow-1 bg-cover bg-center bg-no-repeat border-circle"
                [style.background-image]="'url(' + user?.profilePhoto + ')'" style="width: 2.5rem; height:2.5rem">
              </div>
            <i class="default bi bi-chevron-down"></i>
          </div>
        </ng-template>
      </p-menubar>
      <p-dialog [modal]="true" [(visible)]="visible" [style]="{ width: '25rem' }">
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
            <app-input maxlength="15" mask="phone" label="Telefone" formControlName="phone" type="text" />
          </section>
        </form>
        <ng-template pTemplate="footer">
          <section class="flex justify-content-end">
            <button (click)="saveProfile()" aria-label="salvar dados do usuario" class="add default">Salvar</button>
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
    phone: new FormControl<string | null>(null),
    profilePhoto: new FormControl<FileApp | null>(null)
  })

  ngOnInit(): void {
    this.setItems();
    this.setItemsPopup();
    this.loadUser();
  }
  private loadUser() {
    const usr = this.auth.getUserFromSessionStorage();
    if (usr) {
      this.form.patchValue(usr);
      this.user = new CustomUsuario(usr);
      if (this.user.profilePhoto) {
        this.imagePreview.set(this.user.profilePhoto);
      }
    }
  }

  async saveProfile() {
    const form = this.form.getRawValue();
    if (this.form.valid) {
      if (this.selectedFile) {
        this.value = 30;
        await this.uploadFile(this.selectedFile, form);
      }

      this.auth.updateUser(form).subscribe((u) => {
        if (u.success) {
          const usr = this.auth.getUserFromSessionStorage();
          if (usr) {
            const usrN = new Usuario(u.data as Usuario);
            this.auth.setUserInSessionStorage(usrN);
            this.value = 100;
          }
          this.loadUser();
          this.value = 0;
          this.visible = false;
          this.alert.showMsg('success', 'Perfil', 'dados atualizada com sucesso');
        }
      });
    }
  }

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0] || null;
    if (file) {
      this.imagePreview.set(URL.createObjectURL(file));
      this.selectedFile = file;
    }
  }

  async uploadFile(file: File | null, form: Usuario): Promise<void> {
    this.value = 50;
    return new Promise<void>((resolve, reject) => {
      if (file && file.type.startsWith('image/')) {
        this.value = 70;
        this.fileService.createFile(file)
          .subscribe({
            next: (p: FileApp) => {
              if (p) {
                form.profilePhoto = p;
                this.value = 80;
                resolve();
              }
            },
            error: (err) => {
              this.alert.showMsg('error', 'Erro no upload', 'Ocorreu um erro ao enviar a imagem');
              reject(err);
            }
          });
      } else {
        resolve();
      }
    });
  }

  private navigate(rota: string) {
    this.router.navigate([rota]);
  }

  setItems() {
    this.items = [
      { label: 'Home', icon: 'bi bi-house', command: () => { this.navigate('home') } },
      { label: 'Mensagens', icon: 'bi bi-chat-square-text-fill', command: () => { this.navigate('msg') } },
      {
        label: 'Configurações', icon: 'bi bi-sliders',
        items: [
          { label: 'Cursos', icon: 'bi bi-collection', command: () => { this.navigate('cursos') } },
          { label: 'Usuarios', icon: 'bi bi-people-fill', command: () => { this.navigate('users') } }
        ]
      },
    ]
  }

  setItemsPopup() {
    this.itemsPopup = [
      { label: 'Meu perfil', icon: 'bi bi-person-circle', command: () => { this.visible = true; this.value = 0 } },
      { label: 'Sair', icon: 'bi bi-box-arrow-left', command: () => { this.auth.logout() } }
    ]
  }
}