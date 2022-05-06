
type DefaultArguments =
| string
| boolean
| number
| null
| undefined
| Array<DefaultArguments>

export type ConvertArg<TArg> = 
| {kind: 'string', value: string}
| {kind: 'arg', value: TArg}
type ConvertFn<TCommand, TArguments, TOptions> = (arg: ConvertArg<TArguments>, options: TOptions) => Generator<TCommand>

export interface TemplateGenerator<TCommand, TOptions = BaseTemplateOptions> {
    generate(options: TOptions): Generator<TCommand>
}

export class Template<TCommand, TArguments = DefaultArguments, TOptions  extends BaseTemplateOptions = BaseTemplateOptions> implements TemplateGenerator<TCommand, TOptions>{
    private template: TemplateStringsArray
    private args: TArguments[]
    private convert: ConvertFn<TCommand, TArguments, TOptions>

    constructor(
        template: TemplateStringsArray, 
        args: TArguments[], 
        convert: ConvertFn<TCommand, TArguments, TOptions>
        ) {
        this.template = template
        this.args = args
        this.convert = convert
    }

    *generate(options: TOptions): Generator<TCommand> {
        for (let i = 0; i < this.template.length - 1; i ++) {
            yield* this.convert({kind: 'string', value: this.template[i]}, options)
            yield* this.convert({kind: 'arg', value: this.args[i]}, options)
        }
        yield* this.convert({kind: 'string', value: this.template[this.template.length - 1]}, options)

    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseTemplateOptions {

}