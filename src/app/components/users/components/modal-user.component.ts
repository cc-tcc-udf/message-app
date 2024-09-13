import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth/auth.service';
import { AlertService } from '@utils/services/alert.service';
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
    CheckboxModule, DropdownModule,
    NgIf
  ],
  providers: [],
  templateUrl: './modal-user.component.html',
  styleUrl: './../users.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ModalUserComponent implements OnInit {


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
    private alert: AlertService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    console.log(this.ref.data.user)
    this.getGroups();
  }


  save() {

  }

  getGroups() {

  }

}