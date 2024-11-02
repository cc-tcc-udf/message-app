import { NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-image-uploader',
  template: `
    <section class="w-full modal_usr flex align-items-center justify-content-center">
      <input (change)="onFileChange($event)" hidden accept="image/*" type="file" [id]="fileId">
      <section class="foto">
        <section class="img h-7rem w-7rem" 
                 [ngStyle]="{
                   'background-image': 'url(' + (imagePreview() || '') + ')', 
                   'background-size': 'cover', 
                   'background-position': 'center'
                 }">
          <section *ngIf="value === 0" tabindex="0" 
                   (click)="clickInput()" 
                   (keydown.enter)="clickInput()" 
                   (keydown.space)="clickInput()"
                   class="w-full hidden edit_photo justify-content-center align-items-center h-full">
            <i *ngIf="imagePreview()" class="bi text-orange-500 text-xl bi-pencil"></i>
            <i *ngIf="!imagePreview()" class="bi text-xl bi-person-bounding-box"></i>
          </section>
          <section *ngIf="value > 0" class="w-full flex loading justify-content-center align-items-center h-full">
            <section class="w-5rem">
              <p-progressBar [value]="value"></p-progressBar>
            </section>
          </section>
        </section>
      </section>
    </section>
  `,
  standalone: true,
  imports: [NgStyle, NgIf, ProgressBarModule],
})
export class ImageUploaderComponent {
  fileId: string = `input-${Math.random().toString(36).substring(2)}`;
  @Output() imageSelected = new EventEmitter<File | null>();
  imagePreview = signal('');
  value = 0;

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement?.files?.[0] || null;
    this.uploadFile(file);
  }

  private uploadFile(file: File | null): void {
    if (file && file.type.startsWith('image/')) {
      this.imageSelected.emit(file);
      const reader = new FileReader();
      reader.onloadstart = () => { this.value = 0; }; // Reset progress
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          this.value = Math.round((e.loaded / e.total) * 100);
        }
      };
      reader.onload = () => {
        this.value = 100; // Completed upload
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview.set('');
      this.imageSelected.emit(null);
    }
  }

  clickInput() {
    const inputElement = document.getElementById(this.fileId) as HTMLInputElement;
    inputElement.click();
  }
}
