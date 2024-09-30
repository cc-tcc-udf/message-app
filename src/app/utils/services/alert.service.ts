import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    private messageService: MessageService
  ) { }
  showMsg(severity: 'success' | 'info' | 'warn' | 'error' | 'contrast' | 'secondary', summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }

  getSeverity(status: number): 'success' | 'info' | 'warn' | 'error' | 'contrast' | 'secondary' {
    if (status >= 400 && status < 500) {
      return 'warn';
    }
    return 'error';
  }
}