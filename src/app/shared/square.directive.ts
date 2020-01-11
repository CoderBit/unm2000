import { Directive, ElementRef, Renderer2, SimpleChanges, Input, OnChanges, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appSquare]'
})
export class SquareDirective implements OnChanges {

  searchedWords: string[] = ['umc2', 'UMC2'];
  mine2;
  @Input() text: string;

  @HostBinding('class.rotate') isOpen = false;
  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
    const target = (this.el.nativeElement);
    const v1 = target.querySelector('i');
    console.log('"v1"', v1);
    if (this.isOpen) {
      this.renderer.setStyle(v1, 'transform', 'rotate(-90deg)');
      this.renderer.setStyle(v1, 'transition', '.3s ease');
    } else {
      this.renderer.setStyle(v1, 'transform', 'rotate(0deg)');
      this.renderer.setStyle(v1, 'transition', '.3s ease');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.text) {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.text);
      return;
    }

    const target = (this.el.nativeElement);
    this.mine2 = target.querySelector('.ant-collapse-header');
    this.renderer.setProperty(
      this.mine2,
      'innerHTML',
      this.getFormattedText()
    );
  }

  getFormattedText() {
    const re = new RegExp(`(${this.searchedWords.join('|')})`, 'g');
    // tslint:disable-next-line:max-line-length
    return this.text.replace(re, 'UMC<sup>2</sup><i class="anticon ant-collapse-arrow"><svg viewBox="64 64 896 896" fill="currentColor" width="1em" height="1em" class="ng-tns-c4-0" data-icon="right" aria-hidden="true" style="transform: rotate(90deg)"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path></svg></i>');
  }
}
