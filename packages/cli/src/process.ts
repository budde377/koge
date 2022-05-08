import glob from 'glob'
import path from 'path'
import {writeOutput} from '@koge/core'

export async function run() {
  const files = await new Promise<string[]>((resolve, reject) => glob('./**/*.k.{js,ts}', (err, result) => {
    if (err) return reject(err)
    resolve(result)
  }))
  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const imported = require(path.resolve(file)).default
    writeOutput(imported, {generatorPath: file})
  }

}