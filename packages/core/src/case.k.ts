import { ts, out } from '@koge/ts'
import path from 'path'
import Case from 'case'

export default out(path.join(__dirname, "__generated__", "case.ts"), ts`
import Case from 'case';
${
['pascal', 'camel', 'kebab', 'snake'].map((f) => ts`

export function ${Case.camel(f)}Case(v: string): string {
    return Case.${f}(v);
}
`)
}
`)
