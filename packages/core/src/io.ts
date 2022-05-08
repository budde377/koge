import glob from 'glob'
import { EnhancedAsyncGenerator, enhancedAsyncGenerator } from './generator'
import fs from 'fs/promises'

export class KFile {
  data: Buffer
  constructor(data: Buffer) {
    this.data = data
  }
}

export async function  loadFile(path: string): Promise<KFile | null> {
  try {
    const data = await fs.readFile(path)
    return new KFile(data)    
  } catch(err) {
    return null
  }
}

async function  *filesImpl(pattern: string): AsyncGenerator<KFile> {
  const paths = await new Promise<string[]>((resolve, reject) => {
    glob(pattern, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
  for (const path of paths) {
    const f = await loadFile(path)
    if (f) {
      yield f         
    }
  }
}

export const files = (pattern: string): EnhancedAsyncGenerator<KFile> => enhancedAsyncGenerator(filesImpl(pattern))

export async function writeFile(path: string, data: string): Promise<void> {
  await fs.writeFile(path, data)
}
