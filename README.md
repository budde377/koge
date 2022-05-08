
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


## TODO

This project is very much in its infancy. Here's an overview of what we need:

- [x] Reserve npm packages and organisation.
- [x] Setup intermediate website (domain, hosting, etc.)
- [ ] Support basic set of languages 
- [ ] Implement proper logging (verbose, etc.) 
- [ ] Implement config system (e.g. a file containing koge configuration)


Languages that we want to support

- [x] TypeScript
- [ ] JavaScript
- [ ] JavaScript JSX
- [ ] TypeScript JSX
- [ ] JSON
- [ ] Plaintext
- [ ] GraphQL


