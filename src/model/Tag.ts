import { Document } from './Document'

export class Tag {
    private _name: string;

    get name(): string {
        return this._name;
    }

    constructor(readonly docuent: Document, name: string) {
        this._name = name;
    }
}
