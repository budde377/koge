
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

export abstract class TemplateGenerator<TCommand, TOptions = BaseTemplateOptions> {
    abstract generate(options: TOptions): Generator<TCommand>
}

export class Template<TCommand, TArguments = DefaultArguments, TOptions  extends BaseTemplateOptions = BaseTemplateOptions> extends TemplateGenerator<TCommand, TOptions>{
    private template: ReadonlyArray<string>
    private args: TArguments[]
    private convert: ConvertFn<TCommand, TArguments, TOptions>

    constructor(
        template: ReadonlyArray<string>, 
        args: TArguments[], 
        convert: ConvertFn<TCommand, TArguments, TOptions>
        ) {
        super()
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