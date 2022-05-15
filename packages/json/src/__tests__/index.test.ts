import { json, out } from ".."


describe("json", () => { 
  it("Will generate object", async () => {
    const template = json`
        ${
  {
    foo: 1,
    bar: false
  }}
      `
    const output = out('path.json', template)
    expect(await output.data()).toMatchSnapshot()
  })
})

