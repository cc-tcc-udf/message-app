import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@components/message/message.service';
import { FileApp } from '@models/File';
import { Message } from '@models/Message';
import { ModalViewComponent } from '@shared/modal-view.component';
import { AlertService } from '@utils/services/alert.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-view-msg',
  standalone: true,
  imports: [TabViewModule, NgIf, DatePipe],
  templateUrl: './view-msg.component.html',
  styleUrl: './view-msg.component.scss',
  viewProviders: [DialogService]
})
export class ViewMsgComponent implements OnInit {
  msg!: Message;
  rota: string = '';

  constructor(
    private alert: AlertService,
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
          this.getMsg(id);
        }
        this.rota = params['rota'];
      })
  }

  private getMsg(id: number | string) {
    this.service.getMsg(id)
      .subscribe((res) => {
        if (res.success) {
          this.msg = res.data as Message;
          this.cr.detectChanges();
        }
      })
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
      console.log(ex)
      this.openModal(anexo, ex === 'pdf' ? '80%' : '35%', 'anexo');
    }
  }

  getExtension(name: string) {
    return name?.split('.').pop()?.toLowerCase();
  }

  back() {
    this.router.navigate([this.rota]);
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
}
