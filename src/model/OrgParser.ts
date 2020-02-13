import axios from 'axios'

export default class OrgParser {

    orgPath: string

    constructor(orgPath: string) {
        this.orgPath = orgPath
    }

    async getOrgFileContent(): Promise<any> {
        let resp = await axios.get(this.orgPath)

        return resp.data
    }

    async parseOrgContent() {
        let content = await this.getOrgFileContent()
        console.log(content)
    }
}
