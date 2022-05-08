import fs from 'fs/promises'
import path from 'path'

export abstract class Output {
  path: string
    abstract data(): Promise<string>

    constructor(path: string) {
      this.path = path
    }
}

interface OutputOpts {
    generatorPath: string
}

export async function writeOutput(out: unknown, opts: OutputOpts): Promise<void> {
  if (typeof out !== 'object' || !out) return
  // @ts-expect-error Yes, we can
  if (out[Symbol.asyncIterator]) {
    // @ts-expect-error Yes, we can
    for await (const v of out) {
      await writeOutput(v, opts)
    }
  }
  // @ts-expect-error Yes, we can
  if (out[Symbol.iterator]) {
    // @ts-expect-error Yes, we can
    for (const v of out) {
      await writeOutput(v, opts)
    }
  }
  if (out instanceof Output) {
    const resolvedPath = resolvePath(out.path, opts)
    await fs.mkdir(path.dirname(resolvedPath), {recursive: true})
    const data = await out.data()
    await fs.writeFile(resolvedPath, data)
  }
}

function resolvePath(p: string, opts: OutputOpts): string {
  if (path.isAbsolute(p)) return p
  return path.resolve(path.join(path.dirname(opts.generatorPath), p))
}
