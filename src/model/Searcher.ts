import { Document } from './Document';
import { Member } from './Member';
import { Tag } from './Tag';
import { Area } from './Area';
import { Task } from './Task';

export class ResultNode {
    childs: ResultNode[];

    constructor(readonly parent: ResultNode | undefined, readonly value: Area | Task | Searcher) {
        this.childs = [];
    }
};

export class Searcher {
    memberFilter: Member[] | undefined;
    tagFilter: Tag[] | undefined;
    _result: ResultNode | undefined;

    constructor(readonly document: Document) {
    }

    go() {
        const rootNode = new ResultNode(undefined, this);

        for (const area of this.document.areas) {
            for (const task of area.rootTasks) {
                this._process(rootNode, task);
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
