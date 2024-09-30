import { NgClass, NgIf } from "@angular/common";
import { Component, forwardRef, Input, Optional } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-input',
  standalone: true,
  styleUrl: './shared.scss',
  imports: [NgIf, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
  <div class="input_">
  <label [for]="inputId">{{ label }}</label>
  <div class="content">
      <input 
        [id]="inputId"
        [autocomplete]="autocomplete"
        [type]="showPassword ? 'text' : type"
        [value]="value"
        (input)="onInputChange($event)"
        [disabled]="disabled"
        [ngClass]="{'is-invalid': showError()}" 
        [attr.aria-invalid]="showError()"
        [required]="required"
        [placeholder]="placeholder"/>
      
      <button 
        aria-label="mostrar ou esconder senha"
        *ngIf="type === 'password'"
        type="button" 
        (click)="togglePasswordVisibility()"
        class="toggle-password-btn">
        <i [class]="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
      </button>
    </div>
    <!-- Exibição de erros -->
    <div *ngIf="showError()" class="error-message">
        {{ getErrorMessage() }}
    </div>
  </div>

  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Optional() @Input() type: string = 'text';
  @Optional() @Input() autocomplete: string = '';
  @Input() control?: FormControl | null;
  @Optional() @Input() required: boolean = false;
  @Optional() @Input() placeholder: string = '';
  value: string = '';
  disabled: boolean = false;
  showPassword: boolean = false;
  inputId: string = `input-${Math.random().toString(36).substring(2)}`;

  onChange = (value: string) => { console.log(value) };
  onTouched = () => { };

  writeValue(value: string): void {
    this.value = value;
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
    this.value = input.value;
    this.onChange(this.value);
    this.onTouched();
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
}
