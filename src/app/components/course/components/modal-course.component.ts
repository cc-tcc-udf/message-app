import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubCourse } from '@models/Course';
import { GenericResponse } from '@models/GenericResponse';
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
    CheckboxModule, DropdownModule,
    NgIf
  ],
  providers: [CourseService],
  template: `
  <section class="w-full flex flex-column gap-2">
  <form class="flex flex-column gap-2" [formGroup]="form">
    <div class="flex flex-column gap-2">
      <label for="name">Nome</label>
      <input pInputText id="name" aria-describedby="name-help" formControlName="name" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="abbreviation">Sigla</label>
      <input pInputText id="abbreviation" aria-describedby="code-help" formControlName="abbreviation" />
    </div>
    <div class="flex flex-column gap-2">
      <label for="description">Descrição</label>
      <textarea 
        id="description"
        rows="5" 
        cols="30" 
        formControlName="description"
        pInputTextarea >
    </textarea>
    </div>
    <div *ngIf="!form.controls['isGroup']?.value"  class="flex flex-column gap-2">
    <label for="group">Grupo</label>
      <p-dropdown 
        id="group"
        [options]="groups" 
        formControlName="courseGroupId" 
        placeholder="Selecione um grupo" 
        [editable]="true" 
        optionLabel="name"
        optionValue="id" />
    </div>
    <div class="flex gap-1 align-content-center">
      <p-checkbox formControlName="isGroup" [binary]="true" inputId="status" />
      <label for="status">Grupo</label>
    </div>
  </form>
  <div class="flex justify-content-end gap-2">
    <p-button size="small" severity="success" label="Salvar" (onClick)="save()" />
  </div>
</section>
  `,
  styleUrl: './../course.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ModalCourseComponent implements OnInit {
  groups: SubCourse[] = [];


  form: FormGroup = new FormGroup({
    abbreviation: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    courseGroupId: new FormControl<number | null>(null),
    isGroup: new FormControl<boolean | null>(false),
  })

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef,
    private service: CourseService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    const data = this.ref.data.data;
    console.log(data)
    if (data) {
      this.form.patchValue(data);
    }
    this.getGroups();
  }

  save() {
    const form = this.form.getRawValue();
    if (!form.isGroup) {
      form.courseGroupId = null;
    }
    this.service.create(form).subscribe((p) => {
      if (p.success) {
        this.alert.showMsg("success", 'Curso', p.message);
        this.dialog.close();
      } else {
        this.alert.showMsg("error", 'Curso', p.message);
      }
    })
  }

  getGroups() {
    this.service.getGroups().subscribe((p: GenericResponse) => {
      if (p.success) {
        const data = p.data as SubCourse[];
        const filteredData = data.filter(c => c.id);
        console.log(filteredData);
        this.groups = [{ id: null, name: 'Nenhum' }, ...filteredData];
      }
    });
  }

}