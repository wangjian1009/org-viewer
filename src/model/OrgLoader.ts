import axios from 'axios';

export default class OrgLoader {
  static async load(orgPath: string): Promise<any> {
    let resp = await axios.get(orgPath)

    return resp.data
  }
}
