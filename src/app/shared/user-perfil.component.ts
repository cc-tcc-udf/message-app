import { NgClass, NgIf, NgStyle } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FileService } from "@utils/services/file.service";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressBarModule } from "primeng/progressbar";
import { InputComponent } from "./input.component";

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
  template: `
  `,
})
export class UserPerfilModalComponent implements OnInit {
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

}