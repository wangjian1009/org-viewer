import { Node } from './Node';
import { Document } from './Document';
import { Member } from './Member';
import { Tag } from './Tag';
import { Area } from './Area';
import { Task } from './Task';

export class ResultNode {
    childs: ResultNode[];

    constructor(readonly parent: ResultNode | undefined, readonly value: Node) {
        this.childs = [];
    }
};

export class Searcher {
    memberFilter: Member[] | undefined;
    tagFilter: Tag[] | undefined;
    areaFilter: Area[] | undefined;
    includeArea: boolean;
    _result: ResultNode | undefined;

    constructor(readonly document: Document) {
        this.includeArea = false;
    }

    go() {
        const rootNode = new ResultNode(undefined, this.document);

        for (const area of this.document.areas) {
            var areaNode = rootNode;
            if (this.includeArea) {
                areaNode = new ResultNode(rootNode, area);
            }

            for (const task of area.rootTasks) {
                this._process(areaNode, task);
            }
        }

        this._result = rootNode;
    }

    private _process(parentNode: ResultNode, task: Task) {
        const taskNode = new ResultNode(parentNode, task);

        for (const subTask of task.subTasks) {
            this._process(taskNode, subTask);
        }

        if (taskNode.childs.length > 0 || this._taskNeedProxes(task)) {
            parentNode.childs.push(taskNode);
        }
    }

    private _taskNeedProxes(task: Task): boolean {
        if (this.memberFilter) {
            for (const member of this.memberFilter) {
                if (task.hasMember(member)) {
                    return true;
                }
            }
        }

        if (this.tagFilter) {
            for (const tag of this.tagFilter) {
                if (task.hasTag(tag)) {
                    return true;
                }
            }
        }

        return true;
    }
}
