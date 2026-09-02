import { NgClass, NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CourseService } from '@components/course/course.service';
import { UsersService } from '@components/users/users.service';
import { SubCourse } from '@models/Course';
import { FileApp } from '@models/File';
import { GenericResponse } from '@models/GenericResponse';
import { CustomUsuario, Usuario } from '@models/Usuario';
import { InputComponent } from '@shared/input.component';
import { AlertService } from '@utils/services/alert.service';
import { FileService } from '@utils/services/file.service';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-modal-user-adm',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MultiSelectModule,
    InputComponent,
    NgStyle,
    ProgressBarModule,
    DropdownModule,
    NgClass
],
  viewProviders: [FileService],
  templateUrl: './modal-user.component.html',
  styleUrl: './../../users.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModalUserComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  roles: { label: string; value: string }[] = this.getValues();
  value: number = 0;
  imagePreview = signal('');
  selectedFile: File | null = null;
  groups: SubCourse[] = [];
  user: Usuario | undefined;
  tipoOptions = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false },
  ];

  form: FormGroup = new FormGroup({
    id: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null, [Validators.required]),
    name: new FormControl<string | null>(null, [Validators.required]),
    phone: new FormControl<string | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null),
    roles: new FormControl<string[] | null>(null, [Validators.required]),
    profilePhoto: new FormControl<FileApp | null>(null),
    active: new FormControl<boolean | null>(false),
    id_curso: new FormControl<string | null>(null),
  });

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef,
    private alert: AlertService,
    private service: UsersService,
    private fileService: FileService,
    private courseService: CourseService
  ) {}

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

  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      this.alert.showMsg(
        'error',
        'Error',
        'Por favor, preencha os campos obrigatorios'
      );
      return;
    }
    const form = this.form.getRawValue();
    if (this.selectedFile) {
      this.value = 30;
      await this.saveApi(this.selectedFile, form);
    }
    const service = form.id
      ? this.service.updateAdm(form)
      : this.service.createAdm(form);
    service.subscribe((p) => {
      this.value = 100;
      this.user = p;
      this.value = 0;
      this.alert.showMsg('success', 'Usuário', 'usuário criado com sucesso');
      this.dialog.close(p);
    });
  }

  async saveApi(file: File, form: Usuario): Promise<void> {
    this.value = 50;
    return new Promise<void>((resolve, reject) => {
      this.value = 70;
      this.fileService.createFile(file).subscribe({
        next: (p: FileApp) => {
          if (p) {
            form.profilePhoto = p;
            this.value = 80;
            resolve();
          }
        },
        error: (err) => {
          this.alert.showMsg(
            'error',
            'Erro no upload',
            'Ocorreu um erro ao enviar a imagem'
          );
          reject(err);
        },
      });
    });
  }

  getGroups() {
    this.courseService.getGroups().subscribe((response: GenericResponse) => {
      if (response.success) {
        const data = response.data as SubCourse[];
        this.groups = [
          { id: null, name: 'Nenhum' },
          ...data.filter((c) => c.id),
        ];
      }
    });
  }

  getValues() {
    return [
      { label: 'Administrador', value: 'ADMIN' },
      { label: 'Coordenador', value: 'PROF' },
      { label: 'Auditor', value: 'AUDIT' },
      { label: 'Usuario comun', value: 'USER' },
    ];
  }

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0] || null;
    this.uploadFile(file);
  }

  uploadFile(file: File | null): void {
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      setTimeout(() => {
        reader.onload = () => {
          this.imagePreview.set(reader.result as string);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  }

  isProfSelected(): boolean {
    const selectedRoles = this.form.get('roles')?.value || [];
    return selectedRoles.includes('PROF');
  }
  getControl(control: string) {
    return this.form.get(control) as FormControl;
  }

  showError(control: string): boolean {
    return !!(
      this.getControl(control) &&
      this.getControl(control).invalid &&
      this.getControl(control).touched
    );
  }

  getErrorMessage(control: string): string {
    if (this.getControl(control)?.errors?.['required']) {
      return 'Campo obrigatório';
    }
    return 'Erro no campo';
  }
}
