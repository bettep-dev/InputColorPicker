import {
  inject,
  effect,
  untracked,
  Component,
  viewChild,
  ElementRef,
  forwardRef,
  PLATFORM_ID,
} from '@angular/core'
import {
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { isPlatformBrowser } from '@angular/common';

import {
  Color,
  Palette,
  InputColorPickerDirective,
} from './input-color-picker.directive'

import defaultPalette from './palette.json'

@Component( {

  imports: [
    FormsModule
],
  selector: 'input-color-picker',
  templateUrl: './input-color-picker.html',
  styleUrls: [ './input-color-picker.scss' ],
  providers: [ {

    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef( () => InputColorPickerComponent )
  } ],
} )
export class InputColorPickerComponent extends InputColorPickerDirective {

  public box: any
  public hover ? : Color
  public picker!: Array < Color > ;

  svg = viewChild<ElementRef>( 'svg' )

  private platformId = inject( PLATFORM_ID )
  private element = inject( ElementRef )

  private pickerEffect = effect( () => {

    this.palette()
    this.col()
    this.colorWidth()
    this.colorHeight()

    if ( !isPlatformBrowser( this.platformId ) ) return

    untracked( () => this.setPicker() )
  } )

  /* Set */
  setPicker(): void {

    let palette = this.palette() && this.palette()!.length > 0 ? this.palette()! : defaultPalette

    this.box = [ 0, 0, this.col() * this.colorWidth(), this.colorHeight() * Math.ceil( palette.length / this.col() ) ].join( ' ' )

    this.picker = Array.from( palette, ( p: Palette, i: number ) => new Color( this.colorWidth() * ( i % this.col() ), this.colorHeight() * Math.floor( i / this.col() ), p ) )
  }

  /* Action */
  onOpen(): void {

    this.element.nativeElement.querySelector( '.modal-container' ).classList.add( 'active' )
  }

  onClose(): void {

    this.element.nativeElement.querySelector( '.modal-container' ).classList.remove( 'active' )
  }

  onClick( i: number ): void {

    this.value = this.picker[ i ].palette.code

    this.onChange( this.value )

    this.onClose()
  }

  onInput(): void {

    this.onChange( this.value )

    if ( this.value && this.value.length ) return

    this.onClose()
  }

  onEnter( event ? : any, index ? : number ): void {

    let tooltip = this.element.nativeElement.querySelector( '.tooltip' )

    if ( event ) {

      this.hover = this.picker[ index! ]

      let parent = this.svg()?.nativeElement.getBoundingClientRect()

      let client = event.target.getBoundingClientRect()

      let scroll = this.element.nativeElement.querySelector( '.palette-container' ).scrollTop

      tooltip.style.top = `${ client.top - parent.top - scroll }px`

      tooltip.style.left = `${ client.left - parent.left }px`

      return
    }

    tooltip.classList.add( 'active' )
  }

  onLeave(): void {

    this.element.nativeElement.querySelector( '.tooltip' ).classList.remove( 'active' )
  }

  /* Get */
  get getGray(): boolean {

    return this.raw ? false : true
  }

  get getText(): string {

    return this.raw || this.placeholder()
  }
}
