import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth/auth.service';
import { SubCourse } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';
import { CustomUsuario, Usuario } from '@models/Usuario';
import { AlertService } from '@utils/services/alert.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-modal-course',
  standalone: true,
  imports: [
    ReactiveFormsModule, InputTextModule,
    InputTextareaModule, ButtonModule,
    CheckboxModule, DropdownModule, NgIf
  ],
  providers: [CourseService],
  templateUrl: './modal-course.component.html',
  styleUrl: './../course.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ModalCourseComponent implements OnInit {
  groups: SubCourse[] = [];
  resps: CustomUsuario[] = [];

  tipoOptions = [
    { label: 'Curso', value: false },
    { label: 'Grupo', value: true }
  ];

  form: FormGroup = new FormGroup({
    id: new FormControl<string | null>(null),
    abbreviation: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    courseGroupId: new FormControl<string | null>(null),
    resp: new FormGroup({
      id: new FormControl<string | null>(null)
    }),
    isGroup: new FormControl<boolean | null>(null),
  })

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef,
    private service: CourseService,
    private alert: AlertService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    const data = this.ref.data.data;
    if (data) {
      this.form.patchValue(data);
    }
    this.getGroups();
    this.getProf();
    this.valuesChange();
  }

  private valuesChange() {
    this.form.valueChanges.subscribe((p) => {
      if (p.isGroup !== null) {
        if (!p.isGroup) {
          if (p.courseGroupId) {
            const group = this.groups.find((g) => g.id === p.courseGroupId);
            this.form.get('resp.id')?.patchValue(group?.resp?.id, { emitEvent: false });
          }
        }
      }
    });
  }

  save() {
    const form = this.form.getRawValue();
    if (form.isGroup) {
      form.courseGroupId = null;
    }
    this.service.create(form).subscribe((p) => {
      if (p.success) {
        this.alert.showMsg("success", form.isGroup ? 'Grupo' : 'Curso', p.message);
        this.dialog.close(p);
      } else {
        this.alert.showMsg("error", 'Curso', p.message);
      }
    })
  }

  getGroups() {
    this.service.getGroups()
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const data = response.data as SubCourse[];
          this.groups = [{ id: null, name: 'Nenhum' }, ...data.filter(c => c.id)];
          console.log(this.groups);
        }
      });
  }

  getProf() {
    this.auth.getProf()
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const data = response.data as Usuario[];
          this.resps = data.map((p: Usuario) => new CustomUsuario(p)).filter(c => c.id);
        }
      });
  }

  getValueProf(type: 'img' | 'name') {
    const id = this.form.get('resp.id')?.value;
    const usr = this.resps.find(resp => resp.id === id);
    return type === 'img' ? usr?.profilePhoto : usr?.name;
  }

}