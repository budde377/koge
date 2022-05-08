# Koge, a code generator

Koge is a lightweight framework for writing code generators in JavaScript. 

The framework aims to democratize code generation and making it accessible to more developers.

## Getting started

To install the CLI run:

```sh
$ npm i -D koge
```

You can now run `koge` with

```
$ npm exec koge
```

Great start! This in of itself does nothing. Let's write our first code-generator. 

Let's assume that we want to generate typescript. For this, we'll intall the package:

```sh
$ npm i -D @koge/ts
```

**Notice:** Koge curently relies on `babel` to read your code generators. Therefore, if you're writing your generator in TypeScript, you need to 
setup babel accordingly: [babeljs.io/docs/en/babel-preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript).

```typescript
// hello.k.js
import {ts} from '@koge/ts'

export default out(
    './hello.ts',
    ts`
    export function printHelloWorld() {
        console.log('Hello world')
    }
    `
)
```

Now, running `$ npm exec koge` will generates the file:

```typescript
// hello.ts
// Auto-generated file. Do not modify!
export function printHelloWorld() {
    console.log('Hello world')
}
```

Koge supports nesting and conditional templates and is ultimately just JavaScript, so you can import any existing code to impact your generator.
