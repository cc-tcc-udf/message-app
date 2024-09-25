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
    CheckboxModule, DropdownModule,
    NgIf
  ],
  providers: [CourseService],
  template: `
  <section class="flex flex-column gap-2" style="width: 30dvw;">
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
    <label for="group">Responsavel</label>
      <p-dropdown 
        id="resp"
        [options]="resps" 
        formControlName="resp" 
        placeholder="Selecione um responsavel" 
        [showClear]="true" 
        [filter]="true"
        filterBy="name" 
        optionLabel="name"
        optionValue="id">
        <ng-template pTemplate="selectedItem">
          <div class="flex align-items-center gap-2">
              <div class="shadow-1 bg-cover bg-center bg-no-repeat border-circle"
              [style.background-image]="'url(' + getValueProf('img') + ')'"
              style="width: 1.5rem; height:1.5rem"></div>
              <p class="m-0" >{{ getValueProf('name') }}</p>
          </div>
        </ng-template>
        <ng-template let-resp pTemplate="item">
          <div class="flex align-items-center gap-2">
            <div class="shadow-1 bg-cover bg-center bg-no-repeat w-2rem h-2rem border-circle"
             [style.background-image]="'url(' + resp.profilePhoto + ')'"></div>
            <p class="m-0" >{{ resp.name }}</p>
          </div>
        </ng-template>
      </p-dropdown>
    </div>
    <div class="flex gap-1 align-content-center">
      <p-checkbox formControlName="isGroup" [binary]="true" inputId="status" />
      <label for="status">Grupo</label>
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
  resps: CustomUsuario[] = [];

  form: FormGroup = new FormGroup({
    abbreviation: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    courseGroupId: new FormControl<number | null>(null),
    resp: new FormControl<number | null>(null),
    isGroup: new FormControl<boolean | null>(false),
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
    console.log(data)
    if (data) {
      this.form.patchValue(data);
    }
    this.getGroups();
    this.getProf();
    this.changes();
  }
  private changes() {
    this.form.controls['courseGroupId'].valueChanges
      .subscribe((p) => {
        console.log((p))
      })

  }
  save() {
    const form = this.form.getRawValue();
    if (form.isGroup) {
      form.courseGroupId = null;
    }
    console.log(form)
    // this.service.create(form).subscribe((p) => {
    //   if (p.success) {
    //     this.alert.showMsg("success", 'Curso', p.message);
    //     this.dialog.close();
    //   } else {
    //     this.alert.showMsg("error", 'Curso', p.message);
    //   }
    // })
  }

  getGroups() {
    this.service.getGroups()
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const data = response.data as SubCourse[];
          this.groups = [{ id: null, name: 'Nenhum' }, ...data.filter(c => c.id)];
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
    const id = this.form.get('resp')?.value;
    const usr = this.resps.find(resp => resp.id === id);
    return type === 'img' ? usr?.profilePhoto : usr?.name;
  }

}