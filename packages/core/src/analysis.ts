import { KFile } from "./io";

export type Analysis<TContext, TAttributes> = (f: KFile, rootContext: TContext) => TAttributes

export type AnalysisContextBuilder<TAstNode, TContext, TAttributes> = (node: TAstNode, c: () => TContext, attr: (node: TAstNode) => TAttributes) => TContext

export type AnalysisAttributeBuilder<TAstNode, TContext, TAttributes> =  (node: TAstNode, c: () => TContext, attr: (node: TAstNode) => TAttributes) => TAttributes

export function analysisBuilder<TAstNode, TContext extends Record<string, unknown>, TAttributes> (
    findChildren: (n: TAstNode) => TAstNode[], 
    parse: (f: KFile) => TAstNode,
    contextBuilder: AnalysisContextBuilder<TAstNode, TContext, TAttributes>,
    attributeBuilder: AnalysisAttributeBuilder<TAstNode, TContext, TAttributes>
): Analysis<TContext, TAttributes> {
    return (file, rootContext) => {
        const node = parse(file)
        const contexts:  Map<TAstNode, TContext> = new Map()
        const attributes: Map<TAstNode, TAttributes> = new Map()
        const parents: Map<TAstNode, TAstNode> = new Map()
        function attrLookup(n: TAstNode): TAttributes {
            const attrs = attributes.get(n)
            if (attrs != null) return attrs
            const newAttrs = attributeBuilder(n, ctxLookup(n), attrLookup)
            attributes.set(n, newAttrs)
            return newAttrs
        }

        function ctxLookup(n: TAstNode): () => TContext {
            return () => {
                const ctx = contexts.get(n)
                if (ctx != null) return ctx
                const parentN = parents.get(n)
                const newCtx = parentN ? contextBuilder(n, ctxLookup(parentN), attrLookup) : rootContext
                contexts.set(n, newCtx)
                return newCtx
            }
        }

        const stack = []
        let n: TAstNode | undefined = node
        while (n) {
            const chldrn = findChildren(n)
            for(let i = chldrn.length - 1; i >= 0; i --) {
                const child = chldrn[i]
                stack.push(child)
                parents.set(child, n)
            }
            n = stack.pop()
        }
        return attributeBuilder(node, ctxLookup(node), attrLookup)
    }
}