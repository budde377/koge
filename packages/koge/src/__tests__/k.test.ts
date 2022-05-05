import { k } from "../k"
import { mockPrinter } from "./utils"

describe('k', () => {
    it('it runs', () => {
        expect(mockPrinter(k`
        hello world
        ${true}
        ${1}
        ${1.2}
        ${1.}
        `)).toMatchSnapshot()
    })    
    it('supports nested templates', () => {
        const t = k`
            const v = 1234;
        `
        expect(mockPrinter(k`
            const a = 123;
            ${t}
        `)).toMatchSnapshot()
    })
    it('supports array', () => {
        expect(mockPrinter(k`
            ${[
                1234,
                k` foobar `,
                true,
                [
                    123,
                    ' ',
                    false
                ]
            ]}
        `)).toMatchSnapshot()
    })
})

