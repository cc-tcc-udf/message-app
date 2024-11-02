import { NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { MessageService } from '@components/message/message.service';
import { FileApp } from '@models/File';
import { Links } from '@models/Links';
import { Message } from '@models/Message';
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
  anexos: FileApp[] = [];
  ref: DynamicDialogRef | undefined;
  rota: string = '';
  user = this.auth.getUserFromSessionStorage()
  form: FormGroup = new FormGroup({
    id: new FormControl<number | null>(null),
    course_id: new FormControl<number | null>(null),
    responsible: new FormControl<string | null>(this.user?.uid ? this.user.uid : null),
    title: new FormControl<string | null>(null, [Validators.required]),
    status: new FormControl<string | null>('NAO_ENVIADO'),
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
    private service: MessageService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private cr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.getMsg(id);
        }
        this.rota = params['rota'];
      })
  }

  private getMsg(id: number | string) {
    this.service.getMsg(id)
      .subscribe((res) => {
        if (res.success) {
          console.log(res.data)
          this.form.patchValue(res.data as Message);
          console.log(this.form.getRawValue());
        }
      })
  }

  getControl(control: string) {
    return this.form.get(control) as FormControl;
  }

  save() {
    this.form.markAllAsTouched();
    console.log(this.form.getRawValue());
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

  }

  send() {
    if (this.form.valid) {
      const form = this.form.getRawValue();
      form.status = 'ENVIADO';
    }
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
        this.cr.detectChanges();
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


  back() {
    this.router.navigate([this.rota]);
  }
}
