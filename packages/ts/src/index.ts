import { Analysis, AnalysisAttributeBuilder, analysisBuilder, AnalysisContextBuilder, BaseTemplateOptions, ConvertArg, KFile, loadFile, Output, Template, TemplateGenerator } from "@koge/core";
import parser from '@babel/parser'
import generator from '@babel/generator'
import {Node, VISITOR_KEYS} from '@babel/types'

export {formatting} from '@koge/core'

interface TemplateOptions {
    currentFile: KFile | null
}

class TsOutput extends Output {
    private dataFn: () => Promise<string> 
    data(): Promise<string> {
        return this.dataFn()
    }

    constructor(path: string, data: () => Promise<string>) {
        super(path)
        this.dataFn = data
    }

}

const PARSER_OPTIONS: parser.ParserOptions = {sourceType: 'unambiguous', plugins: ['typescript']}

export function out(p: string, template: Template<TemplateCommand, unknown, TemplateOptions>): Output {
    return new TsOutput(p, async () => {
    const file = await loadFile(p)
    const output = '// Auto-generated file. Do not modify!\n' + [...template.generate({
        currentFile: file ?? null
    })].map((v) => typeof v === 'string' ? v : generator(v, {}).code)
    .join('')
    return generator(parser.parse(output, PARSER_OPTIONS), {}).code
    })
}


type TemplateArgument = 
| string
| number
| boolean
| TemplateGenerator<TemplateCommand>
| null
| undefined
| Array<TemplateArgument>
| Node

type TemplateCommand =  
    | string
    | Node

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
    } else if(arg.value instanceof TemplateGenerator) {
        yield* arg.value.generate(options)
    }
    else if (arg.value != null) {
        yield generator(arg.value, {}).code
    }

}

export function ts(template: TemplateStringsArray, ...args: TemplateArgument[]): Template<TemplateCommand, TemplateArgument, TemplateOptions> {
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
    return parser.parse(file.data.toString('utf-8'), PARSER_OPTIONS)
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

type Context = {id: string}

type Attributes = {findSection(): Node[] | null, isFirstNodeInManualSection(): boolean, isLastNodeInManualSection(): boolean}

function beginSectionCommentValue(id: string): string {
    return `BEGIN MANUAL SECTION (${id})`
}

function endSectionCommentValue(id: string): string {
    return `END MANUAL SECTION (${id})`
}

const manualSectionAnalysis = analysis<Context, Attributes>(
    (n, c) => {
        return c()
    } ,
    (n, c, attr) => {
        return {
            isFirstNodeInManualSection() {
                const ctx = c()
                return !!n.leadingComments?.find((c) => c.value.trim() === beginSectionCommentValue(ctx.id))
            },
            isLastNodeInManualSection() {
                const ctx = c()
                return !!n.trailingComments?.find((c) => c.value.trim() === endSectionCommentValue(ctx.id))
            },
            findSection() {
                let inSection = false
                const nodes = []
                for (const c of findChildren(n)) {
                    if (!inSection && attr(c).isFirstNodeInManualSection()) {
                        inSection = true
                    }
                    if (inSection) {
                        nodes.push(c)
                    }
                    if (inSection && attr(c).isLastNodeInManualSection()) {
                        return nodes
                    }
                }
                for (const c of findChildren(n)) {
                    const section = attr(c).findSection()
                    if (section) {
                        return section
                    }
                }
                return null
            }
        }
    }

)

class ManualSectionTemplate extends TemplateGenerator<TemplateCommand, TemplateOptions> {
    private id: string

    constructor(id: string) {
        super()
        this.id = id
    }

    *generate(options: TemplateOptions): Generator<TemplateCommand> {
        const nodes = options.currentFile ? manualSectionAnalysis(options.currentFile, {id: this.id}).findSection() : []
        yield `/* ${beginSectionCommentValue(this.id)} */`
        if (nodes && nodes.length) {
            const firstNode = nodes[0]
            const lastNode = nodes[nodes.length - 1]
            firstNode.leadingComments = firstNode.leadingComments?.filter((c) => c.value.trim() !== beginSectionCommentValue(this.id)) ?? null
            lastNode.trailingComments = lastNode.leadingComments?.filter((c) => c.value.trim() !== endSectionCommentValue(this.id)) ?? null
    
            for (const node of nodes) {
                yield node
            }    
        }
        yield `/* ${endSectionCommentValue(this.id)} */`
        
    }
}


export function manualSection(id: string): TemplateGenerator<TemplateCommand, TemplateOptions> {
    return new ManualSectionTemplate(id)
}