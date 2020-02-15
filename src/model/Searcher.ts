import { Document } from './Document';
import { TagType } from './Tag';
import { Area } from './Area';
import { Task } from './Task';

type Node = Document | Area | Task;

export class ResultNode {
    childs: ResultNode[];

    constructor(readonly parent: ResultNode | undefined, readonly value: Node) {
        this.childs = [];
    }
}

export class Searcher {
    memberFilter: string[] | undefined;
    tagFilter: string[] | undefined;
    categoryFilter: string[] | undefined;
    areaFilter: string[] | undefined;
    includeArea: boolean;
    _result: ResultNode | undefined;

    constructor(readonly document: Document) {
        this.includeArea = false;
    }

    get result(): ResultNode | undefined {
        return this._result;
    }

    go() {
        const rootNode = new ResultNode(undefined, this.document);

        for (const area of this.document.areas) {
            var areaNode = rootNode;
            if (this.includeArea) {
                areaNode = new ResultNode(rootNode, area);
                rootNode.childs.push(areaNode);
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
        if (this.areaFilter) {
            var areaFound = false;
            for (const areaName of this.areaFilter) {
                if (task.area.title != areaName) {
                    areaFound = true;
                    break;
                }
            }
            if (!areaFound) return false;
        }

        if (this.tagFilter) {
            var tagFound = false;
            for (const tagName of this.tagFilter) {
                const tag = this.document.findTag(TagType.Other, tagName);
                if (tag && task.hasTag(tag)) {
                    tagFound = true;
                    break;
                }
            }
            if (!tagFound) return false;
        }

        if (this.memberFilter) {
            var memberFound = false;
            for (const memberName of this.memberFilter) {
                const member = this.document.findTag(TagType.Member, memberName);
                if (member && task.hasMember(member)) {
                    memberFound = true;
                    break;
                }
            }
            if (!memberFound) return false;
        }

        if (this.categoryFilter) {
            var categoryFound = false;
            for (const categoryName of this.categoryFilter) {
                const category = task.category;
                if (category && category.name == categoryName) {
                    categoryFound = true;
                    break;
                }
            }
            if (!categoryFound) return false;
        }

        return true;
    }

    public clearFilters() {
        this.memberFilter = undefined
        this.tagFilter = undefined
        this.areaFilter = undefined
        this.categoryFilter = undefined
    }
}
