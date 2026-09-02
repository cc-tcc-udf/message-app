import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/input.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-modal-course',
  standalone: true,
  imports: [
    ReactiveFormsModule, InputTextModule,
    InputTextareaModule, ButtonModule,
    CheckboxModule, DropdownModule, InputComponent
  ],
  template: `
  <section class="flex flex-column gap-2" style="width: 30dvw;">
  <form class="flex flex-column gap-2" [formGroup]="form">
    <app-input [control]="getControl('title')" type="text" placeholder="digite o titulo" label="Titulo" formControlName="title"/>
    <app-input [control]="getControl('link')" type="text" placeholder="digite o titulo" label="Link" formControlName="link"/>
  </form>
  <div class="flex justify-content-end pt-2">
    <p-button size="small" severity="success" label="Salvar" (onClick)="save()" />
  </div>
</section>
  `,
  styleUrl: './../../message.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ModalLinksComponent implements OnInit {

  form: FormGroup = new FormGroup({
    id: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null, [Validators.required]),
    link: new FormControl<string | null>(null, [Validators.required]),
  })

  constructor(
    private ref: DynamicDialogConfig,
    private dialog: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    // const data = this.ref.data;
    console.log(this.form.getRawValue());
    // if (data) {
    //   if (data.resp && data.resp.id) {
    //     data.resp = data.resp.id;
    //   }
    //   this.form.patchValue(data);
    // }
  }
  save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return
    const form = this.form.getRawValue();
    this.dialog.close(form);
  }

  getControl(control: string) {
    return this.form.get(control) as FormControl;
  }
}