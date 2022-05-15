import { BaseTemplateOptions, ConvertArg, Output, Template, TemplateGenerator } from "@koge/core"

type TemplateCommand = string
type TemplateOptions = Record<string, unknown>

class JsonOutput extends Output {
  private dataFn: () => Promise<string> 
  data(): Promise<string> {
    return this.dataFn()
  }
  
  constructor(path: string, data: () => Promise<string>) {
    super(path)
    this.dataFn = data
  } 
}

type TemplateArgument = 
| string
| number
| boolean
| TemplateGenerator<TemplateCommand>
| null
| undefined
| object
| Array<TemplateArgument>

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
    yield JSON.stringify(arg.value)
  }
}


export function json(template: TemplateStringsArray, ...args: TemplateArgument[]): Template<TemplateCommand, TemplateArgument, TemplateOptions> {
  return new Template(
    template,
    args,
    convertArgument
  )
}
  

export function out(p: string, template: Template<TemplateCommand, unknown, TemplateOptions>): Output {
  return new JsonOutput(
    p,
    async () => {
      const raw = [...template.generate({})].join('')
      return JSON.stringify(JSON.parse(raw), null, 2)
    }
  )
}