import { NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [
    MenubarModule, AvatarModule, NgFor,
    DynamicDialogModule, MenuModule, DialogModule,
    InputComponent, ReactiveFormsModule, NgStyle,
    ProgressBarModule, NgIf, SkeletonModule
  ],
  template: `
    @if(skeleton){
      <div class="flex align-items-center gap-3">        
        <p-skeleton *ngFor="let i of [].constructor(4)" width="6rem" height="1.75rem"/>
        <p-skeleton shape="circle" size="2.5rem"/>        
      </div>
    } @else {
    <section class="w-full h-full flex-column justify-content-center align-items-center flex">
      <p-menubar appendTo="body" [model]="items">
          <ng-template pTemplate="end">
            <p-menu appendTo="body" #menu [model]="itemsPopup" [popup]="true" />
            <div (click)="menu.toggle($event)" (keydown.enter)="menu.toggle($event)"
            class="flex cursor-pointer align-items-center ml-2 gap-2" tabindex="0" role="button"
            aria-label="Menu de perfil">
            <div class="shadow-1 bg-cover bg-primary-50 bg-center bg-no-repeat border-circle"
            [style.background-image]="'url(' + (user?.profilePhoto ?? 'assets/img/svg/photo.svg') + ')'" 
            style="width: 2.5rem; height: 2.5rem">
             </div>
            <i class="default bi bi-chevron-down"></i>
          </div>
        </ng-template>
      </p-menubar>
      <p-dialog *ngIf="user" [modal]="true" [(visible)]="visible" [style]="{ width: '25rem' }">
        <ng-template pTemplate="header">
          <div class="inline-flex align-items-center justify-content-center gap-2">
            <span class="font-bold white-space-nowrap">
              {{user.name}}
            </span>
          </div>
        </ng-template>
        <section class="w-full modal_usr flex align-items-center justify-content-center">
          <input (change)="onFileChange($event)" hidden accept="image/*" type="file" #fileInput>
          <section class="foto">
            <section class="img h-7rem w-7rem" [ngStyle]="{'background-image': 'url(' + (imagePreview() || 'assets/img/svg/photo.svg') + ')', 
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
    }

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
  private cf = inject(ChangeDetectorRef);
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  ref: DynamicDialogRef | undefined;
  items: MenuItem[] = [];
  itemsPopup: MenuItem[] = [
    { label: 'Meu perfil', icon: 'bi bi-person-circle', command: () => this._toggleProfileDialog(true) },
    { label: 'Sair', icon: 'bi bi-box-arrow-left', command: () => this.auth.logout() }
  ];
  user: CustomUsuario | null = null;

  visible: boolean = false;
  imagePreview = signal('');
  selectedFile: File | null = null;
  value: number = 0;
  skeleton = true;

  form: FormGroup = new FormGroup({
    id: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
    profilePhoto: new FormControl<FileApp | null>(null)
  });

  ngOnInit(): void {
    this.auth.initUser();
    this._loadUser();
  }

  private _loadUser() {
    this.auth.user$
      .subscribe((usr) => {
        if (usr) {
          const u = new CustomUsuario(usr);
          this.user = u;
          this.imagePreview.set(u.profilePhoto ?? '');
          this.items = this._setItems();
          setTimeout(() => {
            this.skeleton = false;
            this.cf.detectChanges();
          }, 500)
        }
      })
  }

  async saveProfile() {
    if (this.form.valid) {
      if (this.selectedFile) {
        await this._uploadFile(this.selectedFile);
      }
      this.auth.updateUser(this.form.getRawValue())
        .subscribe((u) => {
          if (u.success) {
            this.auth.setUserInSessionStorage(new Usuario(u.data as Usuario));
            this._loadUser();
            this.alert.showMsg('success', 'Perfil', 'Dados atualizados com sucesso');
            this._toggleProfileDialog(false);
          }
        });
    }
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagePreview.set(URL.createObjectURL(file));
      this.selectedFile = file;
    }
  }

  private async _uploadFile(file: File | null): Promise<void> {
    if (file && file.type.startsWith('image/')) {
      this.value = 70;
      return new Promise<void>((resolve, reject) => {
        this.fileService.createFile(file).subscribe({
          next: (uploadedFile: FileApp) => {
            this.form.patchValue({ profilePhoto: uploadedFile });
            this.value = 100;
            resolve();
          },
          error: () => {
            this.alert.showMsg('error', 'Erro no upload', 'Ocorreu um erro ao enviar a imagem');
            reject();
          }
        });
      });
    }
  }

  private _toggleProfileDialog(show: boolean) {
    this.visible = show;
    this.value = 0;
  }

  private _setItems(): MenuItem[] {
    const items: MenuItem[] = [
      { label: 'Home', icon: 'bi bi-house', command: () => this._navigate('home') }
    ];
    if (this.auth.isProf() || this.auth.isAdmin()) items.push({ label: 'Mensagens', icon: 'bi bi-chat-square-text-fill', command: () => this._navigate('/msg') });
    if (this.auth.isAdmin()) {
      items.push({
        label: 'Configurações', icon: 'bi bi-sliders',
        items: [
          { label: 'Cursos', icon: 'bi bi-collection', command: () => this._navigate('/cursos') },
          { label: 'Usuarios', icon: 'bi bi-people-fill', command: () => this._navigate('/users') }
        ]
      });
    }
    return items;
  }

  private _navigate(route: string) {
    this.router.navigate([route]);
    this.cf.detectChanges();
  }
}
