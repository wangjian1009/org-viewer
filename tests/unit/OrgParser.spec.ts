import OrgParser from '../../src/model/OrgParser'

describe('OrgParser', () => {
    it("Parse org file content", async () => {
        let p = new OrgParser("http://localhost:8080/SFOX项目工作.org")
        await p.parseOrgContent()
    })
})

