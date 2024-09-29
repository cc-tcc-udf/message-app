import { NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '@components/course/course.service';
import { UsersService } from '@components/users/users.service';
import { SubCourse } from '@models/Course';
import { FileApp } from '@models/File';
import { GenericResponse } from '@models/GenericResponse';
import { AlertService } from '@utils/services/alert.service';
import { FileService } from '@utils/services/file.service';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Observable, tap } from 'rxjs';
import { InputComponent } from "../../../../shared/input.component";

@Component({
  selector: 'app-modal-user-adm',
  standalone: true,
  imports: [
    ReactiveFormsModule, MultiSelectModule,
    NgIf, InputComponent, NgStyle,
    ProgressBarModule, DropdownModule
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

  form: FormGroup = new FormGroup({
    id: new FormControl<number | null>(null),
    email: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
    password: new FormControl<string | null>(null),
    roles: new FormControl<string[] | null>(null),
    profilePhoto: new FormControl<number | null>(null),
    id_curso: new FormControl<number | null>(null)
  })
  user: any;

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef,
    private alert: AlertService,
    private service: UsersService,
    private fileService: FileService,
    private courseService: CourseService,
  ) { }

  ngOnInit(): void {
    console.log(this.roles)
    this.getGroups();
  }


  save() {
    const form = this.form.getRawValue();
    console.log(form)
    this.service.createAdm(form)
      .subscribe((async p => {
        if (p.id && this.selectedFile) {
          await this.saveApi(this.selectedFile, p.id);
        }
        this.dialog.close();
      }))
  }

  getGroups() {
    this.courseService.getGroups()
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const data = response.data as SubCourse[];
          this.groups = [{ id: null, name: 'Nenhum' }, ...data.filter(c => c.id)];
          console.log(this.groups)
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

  saveApi(file: File, id: number): Observable<FileApp> {
    return this.fileService.createFile(id, file).pipe(
      tap((p: FileApp) => {
        this.value = 80;
        if (p) {
          this.value = 100;
          this.alert.showMsg('success', 'Foto de perfil', 'atualizada com sucesso');
          this.value = 0;
        }
      })
    );
  }

}