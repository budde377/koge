import { Analysis, AnalysisAttributeBuilder, analysisBuilder, AnalysisContextBuilder, BaseTemplateOptions, ConvertArg, KFile, out as outKoge, Output, Template, TemplateGenerator } from "@koge/core";
import parser from '@babel/parser'
import generator from '@babel/generator'
import {Node, VISITOR_KEYS} from '@babel/types'

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

function findChildren(n: Node): Node[] {
    const children = []
    for(const key of VISITOR_KEYS[n.type]) {
        // @ts-expect-error Key access on node is kosher
        const entry = n[key] as Array<Node> | null | Node
        if (Array.isArray(entry)) {
            children.push(...entry)
        } else if (entry) {
            children.push(entry)
        }
    }
    return children
}

function parse(file: KFile): Node {
    return parser.parse(file.data.toString('utf-8'))
}

export function analysis<TContext extends Record<string, unknown>, TAttributes>(
    contextBuilder: AnalysisContextBuilder<Node, TContext, TAttributes>,
    attributesBuilder: AnalysisAttributeBuilder<Node, TContext, TAttributes>
): Analysis<TContext, TAttributes> {
    return analysisBuilder<Node, TContext, TAttributes>(
        findChildren,
        parse,
        contextBuilder, 
        attributesBuilder,
    )
}