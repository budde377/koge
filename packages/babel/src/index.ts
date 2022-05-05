import { Template, out as outKoge, Output } from "@koge/koge";
import parser from '@babel/parser'
import generator from '@babel/generator'

export function out(path: string, template: Template): Output {
    let output = ''
    for (const command of template.generate()) {
        output += command.value.toString()
    }
    return outKoge(path, generator(parser.parse(output), {}).code)
}
