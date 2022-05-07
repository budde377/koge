import { Template, TemplateGenerateOptions } from "../k";

export function mockPrinter(t: Template, options?: TemplateGenerateOptions): string {
    let result = ''
    for (const command of t.generate(options)) {
        result += command.value.toString()
    }
    return result
}
