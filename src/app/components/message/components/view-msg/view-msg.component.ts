import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@components/message/message.service';
import { Message } from '@models/Message';
import { AlertService } from '@utils/services/alert.service';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-view-msg',
  standalone: true,
  imports: [TabViewModule],
  templateUrl: './view-msg.component.html',
  styleUrl: './view-msg.component.scss'
})
export class ViewMsgComponent implements OnInit {
  msg!: Message;
  rota: string = '';

  constructor(
    private alert: AlertService,
    private service: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private cr: ChangeDetectorRef
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

  back() {
    this.router.navigate([this.rota]);
  }
}
