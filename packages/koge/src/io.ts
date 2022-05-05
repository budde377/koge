import glob from 'glob'
import { EnhancedAsyncGenerator, enhancedAsyncGenerator } from './generator'
import fs from 'fs/promises'

export interface File {
    data: Buffer

}

async function  loadFile(path: string): Promise<File> {
    const data = await fs.readFile(path)
    return {
        data
    }
}

async function  *filesImpl(pattern: string): AsyncGenerator<File> {
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

export const files = (pattern: string): EnhancedAsyncGenerator<File> => enhancedAsyncGenerator(filesImpl(pattern))

export async function writeFile(path: string, data: string): Promise<void> {
    await fs.writeFile(path, data)
}
