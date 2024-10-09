import { NgFor } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@components/message/message.service';
import { FileApp } from '@models/File';
import { Links } from '@models/Links';
import { InputComponent } from '@shared/input.component';
import { AlertService } from '@utils/services/alert.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Editor, EditorModule } from 'primeng/editor';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ModalLinksComponent } from '../modais/modal-links.component';

@Component({
  selector: 'app-manage-msg',
  standalone: true,
  imports: [ScrollPanelModule, ReactiveFormsModule,
    InputComponent, EditorModule, NgFor],
  templateUrl: './manage-msg.component.html',
  styleUrls: ['./manage-msg.component.scss'],
  providers: [DialogService]
})
export class ManageMsgComponent implements AfterViewInit, OnInit {
  private dialogService = inject(DialogService);
  anexos: FileApp[] = [];
  ref: DynamicDialogRef | undefined;

  form: FormGroup = new FormGroup({
    id: new FormControl<number | null>(null),
    title: new FormControl<string | null>(null, [Validators.required]),
    summary: new FormControl<string | null>(null, [Validators.required]),
    message: new FormControl<string | null>(null, [Validators.required]),
    links: new FormControl<Links[] | null>([]),
    attachments: new FormControl<FileApp[] | null>([])
  });

  editorModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  @ViewChild('editor', { static: false }) editor!: Editor;

  constructor(
    private alert: AlertService,
    private service: MessageService
  ) { }

  ngOnInit(): void {
    console.log(this.anexos)
  }

  getControl(control: string) {
    return this.form.get(control) as FormControl;
  }

  save() {
    if (this.form.valid) {
      this.service.create(this.form.getRawValue())
        .subscribe((response) => {
          if (response.success) {
            this.alert.showMsg('success', 'Sucesso', 'Formulário salvo com sucesso');
            if (response.data)
              this.form.patchValue(response.data)
          }

        })
    } else {
      this.alert.showMsg('error', 'Error', 'Formulário invalid');
    }
    console.log(this.form.getRawValue())

  }

  addLinks() {
    this.ref = this.dialogService.open(
      ModalLinksComponent, {
      header: 'Cadastrar novo link',
      contentStyle: { overflow: 'auto' },
    })

    this.ref.onClose.subscribe((p) => {
      if (p) {
        const links = this.getControl('links').value || [];
        this.getControl('links').setValue([...links, p]);
      }
    });

  }

  addAnexos() {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const quillEditor = this.editor?.getQuill();
      if (quillEditor) {
        const editorRoot = quillEditor.root;
        editorRoot.addEventListener('paste', (e: ClipboardEvent) => {
          if (e.clipboardData && e.clipboardData.items) {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.startsWith('image/')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.alert.showMsg('info', 'Imagem', 'Não é possível vincular imagens nesse campo, por favor adicione na seção de arquivos.');
                break;
              }
            }
          }
        }, { capture: true });

        editorRoot.addEventListener('drop', (e: DragEvent) => {
          if (e.dataTransfer && e.dataTransfer.files) {
            for (let i = 0; i < e.dataTransfer.files.length; i++) {
              if (e.dataTransfer.files[i].type.startsWith('image/')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.alert.showMsg('info', 'Imagem', 'Não é possível vincular imagens nesse campo, por favor adicione na seção de arquivos.');
                break;
              }
            }
          }
        }, { capture: true });
      } else {
        console.error('Quill not initialized');
      }
    }, 500);
  }

}