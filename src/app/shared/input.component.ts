import { NgClass, NgIf } from "@angular/common";
import { Component, forwardRef, Input, OnInit, Optional } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";

@Component({
  selector: 'app-input',
  standalone: true,
  styleUrls: ['./shared.scss'],
  imports: [NgIf, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
  <div class="input_" [ngClass]="{'gap-2': label}">
    <label [for]="inputId">{{ label }} <b *ngIf="isRequired()" class="text-red-500">*</b></label>
    <div [ngClass]="{'is-invalid': showError()}"  class="content" [ngClass]="{'icon-left': iconPosition === 'left', 'icon-right': iconPosition === 'right'}">
      <!-- Ícone à esquerda -->
      <ng-container *ngIf="icon && iconPosition === 'left'">
        <section class="flex align-items-center px-2">
          <i class="font-bold" [class]="icon"></i>
        </section>
      </ng-container>
      
      <input 
        [id]="inputId"
        [autocomplete]="autocomplete"
        [type]="showPassword ? 'text' : type"
        [value]="value"
        (input)="onInputChange($event)"
        [disabled]="disabled"
        [attr.aria-invalid]="showError()"
        [required]="isRequired()"
        [placeholder]="placeholder"
        [attr.maxlength]="maxlength"
        (keydown.enter)="$event.preventDefault()"/>
      
      <!-- Ícone à direita -->
      <ng-container *ngIf="icon && iconPosition === 'right'">
        <section class="vertical-align-middle text-center">
          <i [class]="icon"></i>
        </section>
      </ng-container>

      <!-- Botão para alternar a visibilidade da senha -->
      <button 
        aria-label="mostrar ou esconder senha"
        *ngIf="type === 'password'"
        type="button" 
        (click)="togglePasswordVisibility()"
        class="toggle-password-btn">
        <i [class]="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
      </button>

      <!-- Ícone à direita -->
      <i *ngIf="showError()" class="bi mx-2 bi-exclamation-circle text-red-500"></i>
    </div>
    
    <!-- Exibição de erros -->
    <div *ngIf="showError()" class="error-message">
      {{ getErrorMessage() }}
    </div>

    <!-- Exibição do contador de caracteres restantes -->
    <small *ngIf="maxlength && !showError() && isInfoLength" [id]="inputId" class="text-muted">
      {{ remainingChars }} caracteres restantes
    </small>
  </div>
  `,
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Optional() @Input() type: string = 'text';
  @Optional() @Input() autocomplete: string = '';
  @Input() control?: FormControl | null;
  @Optional() @Input() placeholder: string = '';
  @Optional() @Input() maxlength?: number;
  @Optional() @Input() isInfoLength?: boolean;

  @Input() icon: string = '';  // Classe do ícone, por exemplo, 'bi bi-person'
  @Input() iconPosition: 'left' | 'right' = 'left';  // Posição do ícone
  @Input() mask: string | null = null;

  value: string = '';
  remainingChars: number = 0;
  disabled: boolean = false;
  showPassword: boolean = false;
  inputId: string = `input-${Math.random().toString(36).substring(2)}`;

  ngOnInit(): void {
    if (this.maxlength)
      this.remainingChars = this.maxlength;
  }

  onChange = (value: string) => { console.log(value) };
  onTouched = () => { };

  writeValue(value: string): void {
    this.value = value || '';
    this.updateRemainingChars();
  }


  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let inputValue = input.value;

    if (this.maxlength) {
      const maxLengthValue = this.maxlength;
      if (!isNaN(maxLengthValue) && inputValue.length > maxLengthValue) {
        inputValue = inputValue.substring(0, maxLengthValue);
      }
    }
    this.value = this.mask ? this.setMask(inputValue.replace(/\D/g, '')) : inputValue;
    this.updateRemainingChars();
    this.onChange(this.value);
    this.onTouched();
  }

  setMask(value: string) {
    if (this.mask === 'phone') {
      if (value.length <= 2) {
        return value = `(${value}`;
      } else if (value.length <= 7) {
        return value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length <= 11) {
        return value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else {
        return value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
      }
    }
    return value;
  }

  updateRemainingChars() {
    if (this.maxlength) {
      const maxLengthValue = this.maxlength;
      this.remainingChars = maxLengthValue - (this.value ? this.value.length : 0);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showError(): boolean {
    return !!(this.control && this.control.invalid && this.control.touched);
  }

  getErrorMessage(): string {
    if (this.control?.errors?.['required']) {
      return 'Campo obrigatório';
    }
    return 'Erro no campo';
  }

  isRequired(): boolean {
    return !!this.control?.hasValidator(Validators.required);
  }
}
