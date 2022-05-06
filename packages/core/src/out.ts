import fs from 'fs/promises'
import path from 'path'

export class Output {
    data: string
    path: string

    constructor(data: string, path: string) {
        this.data = data
        this.path = path
    }
}

export function out(path: string, data: string): Output {
    return new Output(data, path)
}

export async function writeOutput(out: unknown): Promise<void> {
    if (typeof out !== 'object' || !out) return
    // @ts-expect-error Yes, we can
    if (out[Symbol.asyncIterator]) {
        // @ts-expect-error Yes, we can
        for await (const v of out) {
            await writeOutput(v)
        }
    }
    // @ts-expect-error Yes, we can
    if (out[Symbol.iterator]) {
    // @ts-expect-error Yes, we can
        for (const v of out) {
            await writeOutput(v)
        }
    }
    if (out instanceof Output) {
        await fs.mkdir(path.dirname(out.path), {recursive: true})
        await fs.writeFile(out.path, out.data)
        }
}
