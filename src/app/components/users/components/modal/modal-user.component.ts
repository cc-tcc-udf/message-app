import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '@components/course/course.service';
import { UsersService } from '@components/users/users.service';
import { SubCourse } from '@models/Course';
import { FileApp } from '@models/File';
import { GenericResponse } from '@models/GenericResponse';
import { CustomUsuario, Usuario } from '@models/Usuario';
import { AlertService } from '@utils/services/alert.service';
import { FileService } from '@utils/services/file.service';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputComponent } from "../../../../shared/input.component";

@Component({
  selector: 'app-modal-user-adm',
  standalone: true,
  imports: [
    ReactiveFormsModule, MultiSelectModule,
    NgIf, InputComponent, NgStyle,
    ProgressBarModule, DropdownModule,
    NgClass
  ],
  providers: [FileService],
  templateUrl: './modal-user.component.html',
  styleUrl: './../../users.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ModalUserComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  roles: { label: string, value: string }[] = this.getValues();
  value: number = 0;
  imagePreview = signal('');
  selectedFile: File | null = null;
  groups: SubCourse[] = [];
  user: Usuario | undefined;

  form: FormGroup = new FormGroup({
    id: new FormControl<number | null>(null),
    email: new FormControl<string | null>(null, [Validators.required]),
    name: new FormControl<string | null>(null, [Validators.required]),
    phone: new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null),
    roles: new FormControl<string[] | null>(null, [Validators.required]),
    profilePhoto: new FormControl<number | null>(null),
    id_curso: new FormControl<number | null>(null)
  })

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef,
    private alert: AlertService,
    private service: UsersService,
    private fileService: FileService,
    private courseService: CourseService,
  ) { }

  ngOnInit(): void {
    const usr: CustomUsuario = this.ref.data.user;
    if (usr) {
      this.form.patchValue(usr);
      if (usr.profilePhoto) {
        this.imagePreview.set(usr.profilePhoto);
      }
    }
    this.getGroups();
  }


  save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      this.alert.showMsg('error', 'Error', 'Por favor, preencha os campos obrigatorios');
      return;
    }
    const form = this.form.getRawValue();
    this.service.createAdm(form)
      .subscribe((p => {
        this.user = p;
        if (p.id && this.selectedFile) {
          this.saveApi(this.selectedFile, p.id);
        } else {
          this.dialog.close(p);
        }
      }))
  }

  getGroups() {
    this.courseService.getGroups()
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const data = response.data as SubCourse[];
          this.groups = [{ id: null, name: 'Nenhum' }, ...data.filter(c => c.id)];
        }
      });
  }

  getValues() {
    return [
      { label: 'Administrador', value: 'ADMIN' },
      { label: 'Coordenador', value: 'PROF' },
      { label: 'Auditor', value: 'AUDIT' },
      { label: 'Usuario comun', value: 'USER' },
    ]
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
      this.selectedFile = file;
      const reader = new FileReader();
      this.value = 70;
      setTimeout(() => {
        this.value = 100;
        reader.onload = () => {
          this.imagePreview.set(reader.result as string);
        }
        reader.readAsDataURL(file);
        this.value = 0;
      }, 1000)
    }
  }

  isProfSelected(): boolean {
    const selectedRoles = this.form.get('roles')?.value || [];
    return selectedRoles.includes('PROF');
  }

  saveApi(file: File, id: number) {
    this.fileService.createFile(id, file)
      .subscribe((file: FileApp) => {
        if (this.user) {
          this.user.profilePhoto = file;
        }
        this.value = 100;
        this.alert.showMsg('success', 'Foto de perfil', 'atualizada com sucesso');
        this.value = 0;
        this.dialog.close(this.user);
      });
  }

  getControl(control: string) {
    return this.form.get(control) as FormControl;
  }

  showError(control: string): boolean {
    return !!(this.getControl(control) && this.getControl(control).invalid && this.getControl(control).touched);
  }

  getErrorMessage(control: string): string {
    if (this.getControl(control)?.errors?.['required']) {
      return 'Campo obrigatório';
    }
    return 'Erro no campo';
  }
}