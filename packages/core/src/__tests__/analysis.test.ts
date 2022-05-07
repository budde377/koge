import { AnalysisAttributeBuilder, analysisBuilder, AnalysisContextBuilder, BaseAttributes, BaseContext } from "../analysis"

type Node = {kind: 'node', children: Ast[]}
type Leaf =  {kind: 'leaf', value: string}

type Ast =
| Node
| Leaf

function analysis<TContext extends BaseContext, TAttributes extends BaseAttributes>(
  attributeBuilder: AnalysisAttributeBuilder<Ast, TContext, TAttributes>,
  contextBuilder?: AnalysisContextBuilder<Ast, TContext, TAttributes>
) {
  return analysisBuilder<Ast, TContext, TAttributes>(
    (n) => n.kind === 'node' ? n.children : [],
    (n) => n,
    attributeBuilder,
    contextBuilder
  )
}

function node(children: Ast[] = []): Node {
  return {kind: 'node', children}
}

function leaf(value: string): Leaf {
  return {kind: 'leaf', value}
}

describe('analysis', () => {
  const printAnalysis = analysis<{indent: string}, {result(): string}>(
    (n, context, attr) => ({
      result(): string {
        const c = context()
        if(n.kind === 'leaf'){
          return `${c.indent}${n.value}\n`
        } else {
          return n.children.map((c: Ast) => attr(c).result()).join('')
        }
      }
    }),
  (n, c) => {
    const ctx = c()
    if (n.kind === 'node') return {indent: ctx.indent + "  "}
    return ctx
  }
  )

  it('will pass context', () => {
    expect(printAnalysis({
      kind: 'leaf'  ,
      value: 'foobar',
    }, {indent: ''}).result()).toMatchSnapshot()
  })

  it('will print complex', () => {
    expect(printAnalysis(
      node([
        node([
          leaf('Hello'),
          node([
            leaf('World'),
            node(
              [
                leaf('how'),
                leaf('is'),    
              ]
            ),
            leaf('life!')
          ]),
          node()
        ])
      ])
      , {indent: ''}).result()).toMatchSnapshot()
  })
})