import { NgClass, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { CourseService } from '@components/course/course.service';
import { MessageService } from '@components/message/message.service';
import { SubCourse } from '@models/Course';
import { FileApp } from '@models/File';
import { GenericResponse } from '@models/GenericResponse';
import { Links } from '@models/Links';
import { Message } from '@models/Message';
import { InputComponent } from '@shared/input.component';
import { AlertService } from '@utils/services/alert.service';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Editor, EditorModule } from 'primeng/editor';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ModalLinksComponent } from '../modais/modal-links.component';

@Component({
  selector: 'app-manage-msg',
  standalone: true,
  imports: [ScrollPanelModule, ReactiveFormsModule,
    InputComponent, EditorModule, NgFor, NgClass, DropdownModule],
  templateUrl: './manage-msg.component.html',
  styleUrls: ['./manage-msg.component.scss'],
  providers: [DialogService]
})
export class ManageMsgComponent implements AfterViewInit, OnInit {
  anexos: Array<File | FileApp> = [];
  ref: DynamicDialogRef | undefined;
  rota: string = '';
  user = this.auth.getUserFromSessionStorage();
  groups: SubCourse[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  form: FormGroup = new FormGroup({
    id: new FormControl<number | null>(null),
    course: new FormControl<number | null>(null),
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
    private cr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private courseService: CourseService,
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
    if (this.user?.id) {
      this.getGroups(this.user?.id);
    }
  }

  private getMsg(id: number | string) {
    this.service.getMsg(id)
      .subscribe((res) => {
        if (res.success) {
          const data = res.data as Message;
          const course = this.groups.find((c: SubCourse) => c.id === data.course?.id);
          this.form.patchValue({ ...data, course: course });
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
      if (p as Links) {
        if (p.title && p.link) {
          const links = this.getControl('links').value || [];
          this.getControl('links').setValue([...links, p]);
          this.cr.detectChanges();
        }
      }
    });

  }

  addAnexos(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const anexos = input.files as FileList;
      console.log(anexos[0] as File);
      this.anexos.push(anexos[0] as File);
    }
  }

  getUrl(anexo: File | FileApp | null): SafeUrl | string {
    if (anexo instanceof File) {
      return URL.createObjectURL(anexo);
    } else {
      return (anexo as FileApp).url;
    }
  }
  getClass(type: string) {
    console.log(type)
    return "bi-pdf"
  }


  viewAnexo(anexo: File | FileApp | null) {
    // const url = URL.createObjectURL(anexo.file);
    // window.open(url, '_blank');
    console.log(anexo)
  }

  removeAnexo(index: number | null) {
    // const attachments = this.anexos || [];
    // attachments.splice(index, 1);
    // this.anexos.push(...attachments);
    console.log(index)
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
  getGroups(id: Number) {
    this.courseService.getByResp(id)
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const data = response.data as SubCourse[];
          this.groups = [{ id: null, name: 'Nenhum' }, ...data.filter(c => c.id)];
          console.log(this.groups);
        }
      });
  }


  back() {
    this.router.navigate([this.rota || 'msg']);
  }
}
