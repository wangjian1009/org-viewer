import { Document } from './Document';
const Org = require('org');

class StackNode {
    constructor(public parent: StackNode | undefined) {
    }
}

export class OrgParser {
    static parseNewDocument(data: string): Document {
        const document = new Document();
        const parser = new OrgParser(document);
        parser.parse(data);
        return document;
    }

    private _stackTop: StackNode | undefined;

    constructor(readonly document: Document) {
    }

    parse(data: string) {
        this._stackTop = new StackNode(undefined);

        const parser = new Org.Parser();

        const model = parser.parse(data, {});

        for (const node of model.nodes) {
            const nodeType: string = node.type;
            if (nodeType == "directive") {
                this._processDirective(node);
            }
            else if (nodeType == "header") {
                this._processHeader(node);
            }
            else {
                console.log(`not supported node ${node}`);
            }
        }
    }

    private _processDirective(node: any) {
        const name = node.directiveName;
        if (name == "title:") {
            this.document.originTitle = node.directiveRawValue;
        }
        else {
            console.log(`ignore directive ${name}`);
        }
    }

    private _processHeader(node: any) {

    }

    private _stackPush() {
    }

    private _stackPop(): StackNode | undefined {
        const top = this._stackTop;
        if (top) {
            this._stackTop = top.parent;
        }
        return top;
    }
}
