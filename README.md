
![Koge](docs/assets/logo.svg)

Stop writing boilerplate code let Koge do it for you!

## Installing

```
npm i -D @koge/ts
```

## Writing your first template

Let's start with a template

```typescript
// hello.k.ts
import path from 'path'
import {ts, out} from '@koge/ts'


out(
  path.join(__dirname, 'hello.ts'),
  ts`
  console.log("Hello World")
  `
)
```

run koge 

```sh
$ npm exec koge
```
