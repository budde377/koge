import fs from 'fs/promises'
import path from 'path'

export abstract class Output {
    path: string
    abstract data(): Promise<string>

    constructor(path: string) {
        this.path = path
    }
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
        const data = await out.data()
        await fs.writeFile(out.path, data)
    }
}
