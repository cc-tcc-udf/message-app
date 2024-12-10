import { NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth/auth.service';
import { CourseService } from '@components/course/course.service';
import { MessageService } from '@components/message/message.service';
import { Course } from '@models/Course';
import { FileApp } from '@models/File';
import { GenericResponse } from '@models/GenericResponse';
import { Links } from '@models/Links';
import { Message } from '@models/Message';
import { InputComponent } from '@shared/input.component';
import { ModalViewComponent } from '@shared/modal-view.component';
import { AlertService } from '@utils/services/alert.service';
import { FileService } from '@utils/services/file.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Editor, EditorModule } from 'primeng/editor';
import { ImageModule } from 'primeng/image';
import { MultiSelectModule } from 'primeng/multiselect';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ModalLinksComponent } from '../utils/modal-links.component';

@Component({
  selector: 'app-manage-msg',
  standalone: true,
  imports: [ScrollPanelModule, ReactiveFormsModule,
    InputComponent, EditorModule, NgFor, NgIf, ConfirmDialogModule,
    NgClass, DropdownModule, ImageModule, MultiSelectModule],
  templateUrl: './manage-msg.component.html',
  styleUrls: ['./manage-msg.component.scss'],
  viewProviders: [DialogService, FileService]
})
export class ManageMsgComponent implements AfterViewInit, OnInit {
  anexos: Array<File | FileApp> = [];
  ref: DynamicDialogRef | undefined;
  rota: string = '';
  user = this.auth.getUserFromSessionStorage();
  courses: Course[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  form: FormGroup = new FormGroup({
    id: new FormControl<string | null>(null),
    courses: new FormControl<Course[] | null>(null),
    responsible: new FormControl<string | null>(this.user?.id ?? null),
    title: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(150)]),
    status: new FormControl<string | null>('NAO_ENVIADO'),
    summary: new FormControl<string | null>(null),
    message: new FormControl<string | null>(null, [Validators.required]),
    links: new FormControl<Links[] | null>([]),
    attachments: new FormControl<FileApp[] | null>([])
  });

  skeleton = {
    create: false,
    send: false,
    remove: false
  }

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
    private courseService: CourseService,
    private fileService: FileService,
    private confirm: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    if (this.user?.id) {
      this.getGroups(this.user?.id);
    }
    this.route.queryParams
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.getMsg(id);
        }
        this.rota = params['rota'];
      })
  }

  private getMsg(id: string) {
    this.service.getMsg(id)
      .subscribe((res) => {
        if (res.success) {
          const data = res.data as Message;
          if (data.attachments) {
            this.anexos = data.attachments;
          }
          const courses = this.courses.filter((c: Course) =>
            data.courses.some((course: Course) => course.id === c.id)
          );
          this.form.patchValue({ ...data, courses: courses });
        }
      })
  }

  getControl(control: string) {
    return this.form.get(control) as FormControl;
  }

  async save(type: 'create' | 'send') {
    this.skeleton[type] = true;
    const form = this.form.getRawValue();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      try {
        await this.saveAnexos(form);
        this.service[type](form)
          .subscribe((response) => {
            if (response.success) {
              this.alert.showMsg('success', 'Sucesso', 'Formulário salvo com sucesso');
              this.skeleton[type] = false;
              if (response.data) {
                const id = (response?.data as Message).id;
                this.router.navigate(['msg', 'msg-view'], { queryParams: { id: id, rota: 'msg' } });
              }
            }
          });
      } catch (error) {
        this.skeleton[type] = false;
        this.alert.showMsg('error', 'Erro', 'Ocorreu um erro ao salvar o formulário' + error);
      }
    } else {
      this.skeleton[type] = false;
      this.alert.showMsg('error', 'Erro', 'Formulário inválido');
    }
  }

  async saveAnexos(form: Message): Promise<void> {
    const anexos = this.anexos || [];

    const promises = anexos.map((anexo: File | FileApp) => {
      if (anexo instanceof File) {
        return this.fileService.createFile(anexo).toPromise()
          .then((fileApp: FileApp | undefined) => {
            if (fileApp) {
              form.attachments = form.attachments || [];
              form.attachments.push(fileApp);
            }
          });
      }
      return Promise.resolve();
    });

    await Promise.all(promises);
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
      const file = anexos[0] as File;

      const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension && allowedExtensions.includes(extension)) {
        this.anexos.push(file);
      } else {
        this.alert.showMsg("warn", "Anexo", 'Esse tipo de anexo não é suportado!')
      }
    }
  }


  getUrl(anexo: File | FileApp | null): SafeUrl | string {
    if (anexo instanceof File) {
      return URL.createObjectURL(anexo);
    } else {
      return (anexo as FileApp).url;
    }
  }

  getClass(fileName: string): string {
    const extension = this.getExtension(fileName);
    switch (extension) {
      case 'pdf':
        return 'bi-file-earmark-pdf-fill ' + extension;
      case 'doc':
      case 'docx':
        return 'bi-file-earmark-word-fill ' + extension;
      case 'xls':
      case 'xlsx':
        return 'bi-file-earmark-excel-fill ' + extension;
      case 'csv':
        return 'bi-filetype-csv ' + extension;
      default:
        return 'bi-file-earmark-fill ' + 'file_';
    }
  }

  viewAnexo(anexo: File | FileApp | null) {
    if (anexo) {
      const ex = this.getExtension(anexo.name);
      this.openModal(anexo, ex === 'pdf' ? '80%' : '35%', 'anexo');
    }
  }

  openModal(obj: unknown, wh: string, title: string) {
    this.dialogService.open(ModalViewComponent, {
      data: obj,
      header: 'Visualizar ' + title,
      width: wh,
      height: wh,
    });
  }

  remove(type: 'link' | 'anexo', index: number) {
    if (type === 'link') {
      this.removeLink(index);
    } else if (type === 'anexo') {
      this.removeAnexo(index);
    }
  }

  removeAnexo(index: number) {
    const attachments = this.form.get('attachments')?.value;
    if (Array.isArray(attachments) && index >= 0 && index < attachments.length) {
      attachments.splice(index, 1); // Remove o item do array
      this.form.get('attachments')?.setValue([...attachments]);
    }
  }

  private removeLink(index: number) {
    const links = this.form.get('links')?.value;
    if (Array.isArray(links) && index >= 0 && index < links.length) {
      const obj = links[index];
      if (obj.id) {
        links.splice(index, 1);
        this.form.get('links')?.setValue([...links]);
      }
    }
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
  getGroups(id: string) {
    this.courseService.getByResp(id)
      .subscribe((response: GenericResponse) => {
        if (response.success) {
          const data = response.data as Course[];
          this.courses = [...data.filter(c => !c.isGroup)];

          if (this.courses.length === 1) {
            this.form.patchValue({ courses: [this.courses[0]] })
          }

        }
      });
  }

  getExtension(name: string) {
    return name?.split('.').pop()?.toLowerCase();
  }

  back() {
    this.router.navigate([this.rota || 'msg']);
  }

  showError(control: string): boolean {
    return !!(this.getControl(control) && this.getControl(control).invalid && this.getControl(control).touched);
  }

  removeMsg() {
    this.skeleton.remove = true;
    this.confirm.confirm({
      header: 'Desativar mensagem',
      message: 'Ao continuar, a mensagem será desativada e inacessível ao aluno. Esta ação é irreversível. ',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      rejectLabel: "Não",
      acceptLabel: "Sim",

      accept: () => {
        this.disable();
      },
      reject: () => {
        this.skeleton.remove = false;
      }
    });
  }

  disable(): void {
    const id = this.form.controls['id'].value;
    if (id) {
      this.service.remove(id).subscribe((resp) => {
        this.skeleton.remove = false;
        if (resp.success) {
          this.form.patchValue(resp.data as Message);
          this.alert.showMsg('success', 'Message', 'Messagem desabilitado com sucesso!');
        } else {
          this.alert.showMsg('error', 'Message', 'Erro ao desabilitado a messagem!');
        }
      });
    } else {
      this.skeleton.remove = false;
      this.alert.showMsg('error', 'Message', 'Erro ao desabilitado a messagem!');
    }
  }

  view() {
    this.router.navigate(['msg', 'msg-view'], { queryParams: { id: this.form.controls['id'].value, rota: 'home' } });
  }
}
