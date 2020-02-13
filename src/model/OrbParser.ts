import { Document } from './Document';

export class OrgParser {
    constructor(readonly document: Document) {
    }

    parse(data: string) {
    }

    static parseNewDocument(data: string): Document {
        const document = new Document();
        const parser = new OrgParser(document);
        parser.parse(data);
        return document;
    }
}

