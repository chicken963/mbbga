import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appAudioTime]'
})
export class AudioTimeDirective {

  @Input() timeMask: string = '00:00';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.trim().replace(/[^0-9]/g, '');

    if (value.length > this.timeMask.length) {
      value = value.slice(0, this.timeMask.length);
    }

    let maskedValue = '';
    let maskIndex = 0;

    for (let i = 0; i < value.length && maskIndex < this.timeMask.length; i++) {
      maskedValue += this.timeMask[maskIndex] === ':' ? ':' : value[i];
      maskIndex++;
    }

    input.value = maskedValue;
  }

}
