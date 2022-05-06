#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
require('@babel/register')({
    extensions: ['.ts', '.js']
})
import {run} from './process'

run().catch(err => {
    console.error(err)
    process.exit(1)
})
