import { Node } from './Node';
import { Document } from './Document';
import { Area } from './Area';
import { Task } from './Task';
const Org = require('org');

class StackNode {
    constructor(
        readonly parent: StackNode | undefined,
        readonly level: number,
        readonly node: Node
    ) {
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
        this._stackTop = new StackNode(undefined, 0, this.document);

        const parser = new Org.Parser();

        const model = parser.parse(data, {});

        for (const node of model.nodes) {
            this._processNode(node);
        }
    }

    private _processNode(node: any) {
        const nodeType = node.type;
        if (nodeType === Org.Node.types.directive) {
            this._processDirective(node);
        }
        else if (nodeType === Org.Node.types.header) {
            this._processHeader(node);
        }
        else if (nodeType === Org.Node.types.inlineContainer) {
            this._processInlineContainer(node);
        }
        else {
            console.log(`not supported node ${node}`);
            return;
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
        //console.log(node);

        const level = <number>node.level;
        this._stackPopToLevel(level);

        if (level == 1) {
            const area = new Area(this.document);
            this._stackPush(level, area);
            this._processChildren(node);
        }
        else {
            const area = this._stackArea();
            if (area) {
                const task = new Task(this.document, area, this._stackTask());
                this._stackPush(level, task);
                this._processChildren(node);
            }
        }
    }

    private _processChildren(orgNode: any) {
        for (const child of orgNode.children) {
            this._processNode(child);
        }
    }

    private _processInlineContainer(orgNode: any) {
        const node = this._stackTop ? this._stackTop.node : undefined;
        if (!node) return;

        var title: string | undefined;

        for (const child of orgNode.children) {
            if (child.type === Org.Node.types.text) {
                if (title) {
                    title = title + child.value;
                }
                else {
                    title = child.value;
                }
            }
        }

        node.originTitle = title;
    }

    private _stackTask(): Task | undefined {
        if (this._stackTop && this._stackTop.level > 1) {
            return <Task>(this._stackTop.node);
        }
    }

    private _stackArea(): Area | undefined {
        var node = this._stackTop;
        while (node) {
            if (node.level == 1) {
                return <Area>node.node;
            }
            node = node.parent;
        }
        return undefined;
    }

    private _stackPush(level: number, node: Node) {
        this._stackTop = new StackNode(this._stackTop, level, node);
    }

    private _stackPopToLevel(level: number) {
        while (this._stackTop && this._stackTop.level >= level) {
            this._stackPop();
        }
    }

    private _stackPop(): StackNode | undefined {
        const top = this._stackTop;
        if (top) {
            this._stackTop = top.parent;
        }
        return top;
    }
}
