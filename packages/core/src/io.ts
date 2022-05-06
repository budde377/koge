import glob from 'glob'
import { EnhancedAsyncGenerator, enhancedAsyncGenerator } from './generator'
import fs from 'fs/promises'

export class KFile {
    data: Buffer
    constructor(data: Buffer) {
        this.data = data
    }
}

async function  loadFile(path: string): Promise<KFile> {
    const data = await fs.readFile(path)
    return new KFile(data)
}

async function  *filesImpl(pattern: string): AsyncGenerator<KFile> {
    const paths = await new Promise<string[]>((resolve, reject) => {
        glob(pattern, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
    for (const path of paths) {
        yield await loadFile(path)
    }
}

export const files = (pattern: string): EnhancedAsyncGenerator<KFile> => enhancedAsyncGenerator(filesImpl(pattern))

export async function writeFile(path: string, data: string): Promise<void> {
    await fs.writeFile(path, data)
}
