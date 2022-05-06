import fs from 'fs/promises'
import path from 'path'

export type Output = {
    data: string,
    path: string
}

export function out(path: string, data: string): Output {
    return {path, data}
}

export async function writeOutput(out: Output): Promise<void> {
    await fs.mkdir(path.dirname(out.path), {recursive: true})
    await fs.writeFile(out.path, out.data)
}
