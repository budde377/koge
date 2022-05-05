type TemplateArgument = 
| string
| number
| boolean
| TemplateGenerator
| Array<TemplateArgument>

export type TemplateGenerateOptions = unknown

interface TemplateGenerator {
    generate(opts?: TemplateGenerateOptions): Generator<TemplateCommand>
}

export type Template = TemplateGenerator

type TemplateCommand = 
| {kind: 'string', value: string}
| {kind: 'number', value: number}
| {kind: 'boolean', value: boolean}

function *convertArgument(arg: TemplateArgument, options?: TemplateGenerateOptions): Generator<TemplateCommand> {
    if (typeof arg === 'string') {
        yield {kind: 'string', value: arg}
    } else if (typeof arg === 'number') {
        yield {kind: 'number', value: arg}
    } else if (typeof arg === 'boolean') {
        yield {kind: 'boolean', value: arg}
    } else if(Array.isArray(arg)) {
        for (const innerArg of arg) {
            yield* convertArgument(innerArg, options)
        }
    } else {
        yield* arg.generate(options)
    }

}

export function k(template: TemplateStringsArray, ...args: TemplateArgument[]): Template {
    return {
        *generate(options?: TemplateGenerateOptions) {
            for (let i = 0; i < template.length - 1; i ++) {
                yield {kind: 'string', value: template[i]}
                for (const command of convertArgument(args[i], options)) {
                    yield command
                }
            }
            yield {kind: 'string', value: template[template.length - 1]}
        }
    }
}
