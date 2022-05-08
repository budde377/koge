import { ts, out, formatting } from '@koge/ts'

export default out('./__generated__/case.ts', ts`
import Case from 'case';
${
  ['pascal', 'camel', 'kebab', 'snake'].map((f) => ts`

export function ${formatting.camelCase(f + "Case")}(v: string): string {
    return Case.${f}(v);
}
`)
}
`)
