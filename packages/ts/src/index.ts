import { BaseTemplateOptions, ConvertArg, out as outKoge, Output, Template, TemplateGenerator } from "@koge/core";
import parser from '@babel/parser'
import generator from '@babel/generator'

export function out(p: string, template: Template<TemplateCommand>): Output {
    const output = '// Auto-generated file. Do not modify!\n' + [...template.generate({})].join('')
    return outKoge(p, generator(parser.parse(output, {sourceType: 'unambiguous', plugins: ['typescript']}), {}).code)
}


type TemplateArgument = 
| string
| number
| boolean
| TemplateGenerator<TemplateCommand>
| null
| undefined
| Array<TemplateArgument>

type TemplateCommand =  string

function *convertArgument(arg: ConvertArg<TemplateArgument>, options: BaseTemplateOptions): Generator<TemplateCommand> {
    if (typeof arg.value === 'string') {
        yield arg.value
    } else if (typeof arg.value === 'number') {
        yield arg.value.toString()
    } else if (typeof arg.value === 'boolean') {
        yield arg.value.toString()
    } else if(Array.isArray(arg.value)) {
        for (const innerArg of arg.value) {
            yield* convertArgument({kind: 'arg', value: innerArg}, options)
        }
    } else if(arg.value != null) {
        yield* arg.value.generate(options)
    }

}

export function ts(template: TemplateStringsArray, ...args: TemplateArgument[]): Template<string, TemplateArgument> {
    return new Template(
        template,
        args,
        convertArgument
    )
}
