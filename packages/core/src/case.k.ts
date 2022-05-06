import { ts, out, formatting, manualSection } from '@koge/ts'
import path from 'path'

export default out(path.join(__dirname, "__generated__", "case.ts"), ts`
import Case from 'case';
${
['pascal', 'camel', 'kebab', 'snake'].map((f) => ts`

export function ${formatting.camelCase(f + "Case")}(v: string): string {
    ${manualSection(f)}
    return Case.${f}(v);
}
`)
}
`)
