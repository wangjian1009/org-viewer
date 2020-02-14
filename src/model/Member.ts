import { Document } from './Document'

export class Member {
    private _name: string;

    get name(): string {
        return this._name;
    }

    constructor(readonly document: Document, name: string) {
        this._name = name;
        this.document._addMember(this);
    }

    dispose() {
        this.document._removeMember(this);
    }
}
