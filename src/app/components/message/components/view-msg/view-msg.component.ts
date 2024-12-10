import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@components/message/message.service';
import { FileApp } from '@models/File';
import { Message, ViewMessage } from '@models/Message';
import { Status } from '@models/Status';
import { ErrosComponent } from '@shared/errors.component';
import { ModalViewComponent } from '@shared/modal-view.component';
import { DialogService } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TabViewModule } from 'primeng/tabview';
import { ListViewsComponent } from "./list-view/list-views.component";

@Component({
  selector: 'app-view-msg',
  standalone: true,
  imports: [TabViewModule, NgIf, NgFor, DatePipe,
    ListViewsComponent, ErrosComponent, SkeletonModule],
  templateUrl: './view-msg.component.html',
  styleUrl: './view-msg.component.scss',
  viewProviders: [DialogService]
})
export class ViewMsgComponent implements OnInit {
  msg!: Message;
  rota: string = '';
  id!: string;
  views: ViewMessage[] = [];
  isEnviado: boolean = false;
  skeleton: boolean = true;
  constructor(
    private service: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private cr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.id = id;
          this.getMsg(id);
        } else {
          this.skeleton = false;
        }
        this.rota = params['rota'];
      })
  }

  private getMsg(id: number | string) {
    this.service.getMsg(id)
      .subscribe((res) => {
        if (res.success) {
          this.skeleton = false;
          if (res.data) {
            const data = res.data as Message;
            this.msg = data
            this.isEnviado = this.getStatus(data.status) === 'Enviado';
            this.cr.detectChanges();
          }
        }
      })
  }

  getStatus(s: string): string {
    return Status[s as keyof typeof Status];
  }

  openModal(obj: unknown, wh: string, title: string) {
    this.dialogService.open(ModalViewComponent, {
      data: obj,
      header: 'Visualizar ' + title,
      width: wh,
      height: wh,
    });
  }

  viewAnexo(anexo: File | FileApp | null) {
    if (anexo) {
      const ex = this.getExtension(anexo.name);
      this.openModal(anexo, ex === 'pdf' ? '80%' : '35%', 'anexo');
    }
  }

  getExtension(name: string) {
    return name?.split('.').pop()?.toLowerCase();
  }

  removeMsg() {
    throw new Error('Method not implemented.');
  }

  back() {
    this.router.navigate([this.rota]);
  }

  edit(): void {
    this.router.navigate(['msg', 'msg-manage'], { queryParams: { id: this.msg.id, rota: this.rota } });
  }

  getCourse() {
    const c = this.msg?.courses;
    let v = '';
    c?.forEach((course, index) => {
      v += course.name + '(' + course.abbreviation + ')';
      if (index < c.length - 1) {
        v += ' | ';
      }
    });
    return v;
  }

  onTabChange(index: number) {
    if (index === 1) {
      this.getViews();
    }
  }

  getViews() {
    const id = this.id;
    this.service.getViews(id)
      .subscribe((res) => {
        if (res.success) {
          this.views = res.data as ViewMessage[];
        }
      })
  }
}
