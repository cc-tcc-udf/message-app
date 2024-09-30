import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/input.component';
import { EditorModule } from 'primeng/editor';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-manage-msg',
  standalone: true,
  imports: [ScrollPanelModule, ReactiveFormsModule, InputComponent, EditorModule],
  templateUrl: './manage-msg.component.html',
  styleUrl: './manage-msg.component.scss'
})
export class ManageMsgComponent {
  form: FormGroup = new FormGroup({
    id: new FormControl<number | null>(null),
    title: new FormControl<string | null>(null, [Validators.required]),
    summary: new FormControl<string | null>(null, [Validators.required]),
    message: new FormControl<string | null>(null, [Validators.required]),
  })

  editorModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],  // Tamanhos de cabeçalho
      ['bold', 'italic', 'underline'],  // Negrito, itálico, sublinhado
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Listas ordenadas e com marcadores
      [{ 'align': [] }],  // Alinhamento
      ['clean']  // Botão para limpar formatação
    ]
  };

  getControl(control: string) {
    return this.form.get(control) as FormControl;
  }
}
