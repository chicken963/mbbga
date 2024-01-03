import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appParentWidth]'
})
export class ParentWidthDirective implements OnInit {
  @Input() threshold: number = 98;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.toggleVisibility();

    window.addEventListener('resize', () => {
      this.toggleVisibility();
    });
  }

  private toggleVisibility() {
    const parentWidth = this.el.nativeElement.parentElement?.parentElement?.offsetWidth;
    if (parentWidth !== undefined) {
      this.renderer.setStyle(
          this.el.nativeElement,
          'display',
          parentWidth > this.threshold ? 'inline-flex' : 'none'
      );
    }
  }
}
