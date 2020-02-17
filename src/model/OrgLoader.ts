import axios from 'axios'
import { Base64 } from 'js-base64'

export default class OrgLoader {
  static async load(orgPath: string): Promise<any> {
    let resp = await axios.get(orgPath)

    return resp.data
  }

  static async loadFromGitlab(orgPath: string): Promise<any> {
    let resp: any = await axios.get(orgPath)
    let content = resp["data"]["content"]

    return Base64.decode(content)
  }
}
