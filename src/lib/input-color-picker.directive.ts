import {
  input,
  Directive,
} from "@angular/core"
import {
  ControlValueAccessor
} from "@angular/forms"

export class Color {

  public x: number
  public y: number

  public palette: Palette

  constructor ( x: number, y: number, palette: Palette ) {

    this.x = x
    this.y = y

    this.palette = palette
  }
}

export class Palette {

  public code: string
  public name: string

  constructor ( code: string, name: string ) {

    this.code = code
    this.name = name
  }
}

@Directive( {

  selector: '[col], [palette], [boxHeight], [colorWidth], [colorHeight], [placeholder]',
} )
export class InputColorPickerDirective implements ControlValueAccessor {

  public raw: string | undefined

  public onChange: any = () => {}
  public onTouched: any = () => {}

  public col = input<number>( 40 )
  public palette = input<Palette[] | undefined>( undefined )
  public boxHeight = input<number>( 48 )
  public colorWidth = input<number>( 20 )
  public colorHeight = input<number>( 20 )
  public placeholder = input<string>( 'Color selection' )

  get value(): string | undefined {

    return this.raw
  }

  set value( raw: string | undefined ) {

    if ( this.raw !== raw ) this.raw = raw
  }

  writeValue( raw: string ) {

    this.raw = raw
  }

  registerOnChange( func: any ): void {

    this.onChange = func
  }

  registerOnTouched( func: any ): void {

    this.onTouched = func
  }
}