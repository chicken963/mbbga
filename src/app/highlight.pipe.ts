import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(
      private sanitizer: DomSanitizer
  ) {}
  transform(value: string, query: string): any {
    if (!query || !value) {
      return value;
    }
    let valueWithHighlightedSnippet = value.replace(
        new RegExp(query, 'gi'),
        match => `<span style="color: black; background-color: yellow">${match}</span>`);
    return  this.sanitizer.bypassSecurityTrustHtml(valueWithHighlightedSnippet);
  }

}
