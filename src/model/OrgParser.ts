import moment from 'moment';
import { Document } from './Document';
import { Area } from './Area';
import { Task } from './Task';
import { Tag, TagType } from './Tag';
import { State } from './State';

type Node = Document | Area | Task;

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

  debug: boolean = true;
  private _stackTop: StackNode | undefined;
  private _drawerName: string | undefined;
  private _tagGroupIdx = 0;

  constructor(readonly document: Document) {
  }

  parse(data: string) {
    this._stackTop = new StackNode(undefined, 0, this.document);
    this._drawerName = undefined;

    const lines = data.split(/\r?\n/);
    for (const line of lines) {
      this._processLine(line);
    }
  }

  private _processLine(line: string) {
    if (line.length == 0) return;

    const setupLine = line.match(/^\s*#\+(TITLE|TAG|STARTUP|SEQ_TODO|TODO|TAGS|CATEGORY):(.*)$/i);
    if (setupLine) {
      this._processSetupLine(setupLine[1].toUpperCase(), setupLine[2]);
      return;
    }

    const directiveLine = line.match(/^(\s*)#\+(?:(begin|end)_)?(.*)$/i); // m[1] => indentation, m[2] => type, m[3] => content
    if (directiveLine) {
      this._processDirectiveLine(directiveLine[1], directiveLine[2], directiveLine[3]);
      return;
    }

    const drawerLine = line.match(/^\s*:(\w+):(.*)$/);
    if (drawerLine) {
      const drawerLineTag = drawerLine[1];

      if (!this._drawerName) {
        this._drawerName = drawerLineTag;
      }
      else {
        if (drawerLineTag.toLocaleLowerCase() == 'end') {
          this._drawerName = undefined;
        }
        else {
          this._processLineDrawer(drawerLineTag, drawerLine[2]);
        }
      }
      return;
    }

    if (this._drawerName) {
      if (this.debug) console.log(`ignore in drawer ${this._drawerName}: ${line}`);
      return;
    }

    const scheduleRegex = /^\s*(SCHEDULED|DEADLINE):\s+<([^>]*)>(.*)$/i;
    var scheduleLine = line.match(scheduleRegex);
    if (scheduleLine) {
      while (scheduleLine) {
        line = scheduleLine[3];
        this._processScheduleTime(scheduleLine[1].toUpperCase(), scheduleLine[2]);
        scheduleLine = line.match(scheduleRegex);
      }
      return;
    }

    this._processLineNormal(line);
  }

  private _processScheduleTime(scheduleType: string, scheduleValue: string) {
    if (!this._stackTop) return;

    const task = <Task>this._stackTop.node;
    if (!task) return;

    const timeMatcher = scheduleValue.match(/^(\d{4})-(\d{2})-(\d{2})\s+\w+$/);
    if (timeMatcher) {
      const scheduleDate = moment(`${timeMatcher[1]}-${timeMatcher[2]}-${timeMatcher[3]}`);
      if (scheduleType == "SCHEDULED") {
        task.originScheduled = scheduleDate;
      }
      else if (scheduleType == "DEADLINE") {
        task.originDeadline = scheduleDate;
      }
      else {
        if (console.debug) {
          console.log(`ignore unknown schedule type ${scheduleType}`);
        }
      }
    }
    else {
      if (console.debug) {
        console.log(`ignore unknown schedule value ${scheduleValue}`);
      }
    }
  }

  private _processLineDrawer(drawTag: string, left: string) {
    if (drawTag.toUpperCase() == "ID") {
      if (this._stackTop) {
        const node = this._stackTop.node;
        if ((<Task>node)) {
          (<Task>node).originPersistentId = left.trim();
        }
      }
    }
    else {
      console.log(`process draw ${drawTag}`);
    }
  }

  private _processLineNormal(line: string) {
    const headerLine = line.match(/^(\*+)\s+(.*)$/);
    if (headerLine) {
      this._processHeader(headerLine[1], headerLine[2]);
      return;
    }
    else {
      if (this.debug) {
        console.log(`ignore normal line ${line}`);
      }
    }
  }

  private _processSetupLine(tag: string, content: string) {
    if (tag == "TITLE") {
      this.document.originTitle = content.trim();
    }
    else if (tag == "TAGS") {
      if (content.trim().length == 0) {
        return;
      }

      this._tagGroupIdx++;
      var tagType = TagType.Other;
      if (this._tagGroupIdx == 1) {
        tagType = TagType.Member;
      }
      else if (this._tagGroupIdx == 2) {
        tagType = TagType.Category;
      }

      const tags = content.split(/\s+/);
      for (var tagName of tags) {
        if (tagName.length == 0) {
          continue;
        }

        const m = tagName.match(/^(.*)\(.*\)$/);
        if (m) {
          tagName = m[1];
        }

        new Tag(this.document, tagType, tagName);
      }
    }
    else if (tag == "SEQ_TODO" || tag == "TODO") {
      var isDone = false;
      const states = content.split(/\s+/);
      for (var stateName of states) {
        if (stateName.length == 0) continue;

        if (stateName == '|') {
          isDone = true;
          continue;
        }

        const stateNameMatcher = stateName.match(/^(.+)\(.*\)$/);
        if (stateNameMatcher) {
          stateName = stateNameMatcher[1];
        }

        new State(this.document, stateName, isDone);
      }
    }
    else {
      if (this.debug) {
        console.log(`ignore setup ${tag}`);
      }
    }
  }

  private _processDirectiveLine(indentation: string, tag: string, content: string) {
    if (this.debug) {
      console.log(`ignore directive ${tag}`);
    }
  }

  private _processHeader(leader: string, left: string) {
    const level = leader.length;
    this._stackPopToLevel(level);

    const parts = left.split(/\s*:\s*/);

    var title: string | undefined;
    var members: Tag[] | undefined;
    var tags: Tag[] | undefined;
    var category: Tag | undefined;
    var state: State | undefined;
    var priority: string | undefined;

    if (parts.length) {
      title = parts[0].trim();

      for (var i = 1; i < parts.length; ++i) {
        const tagName = parts[i].trim();
        if (tagName.length == 0) continue;

        const tag = this.document.findTagByName(tagName);
        if (!tag) {
          if (this.debug) {
            console.log(`ignore not exist tag ${tagName}`);
          }
          continue;
        }

        switch (tag.type) {
          case TagType.Category:
            if (!category) {
              category = tag;
            }
            else {
              if (this.debug) {
                console.log(`ignore duplicate category ${tag.name}`);
              }
            }
            break;
          case TagType.Member:
            if (!members) {
              members = [];
            }
            members.push(tag);
            break;
          case TagType.Other:
            if (!tags) {
              tags = [];
            }
            tags.push(tag);
            break;
        }
      }
    }

    if (title) {
      const stateLine = title.match(/^(\w+)\s+(.*)$/);
      if (stateLine) {
        const stateName = stateLine[1];
        state = this.document.findState(stateName);
        if (state) {
          title = stateLine[2];
        }
      }
    }

    while (title) {
      const argMatcher = title.match(/^\[(.*)\]\s+(.*)$/);
      if (!argMatcher) break;

      const arg = argMatcher[1];
      title = argMatcher[2];

      const priorityMatcher = arg.match(/^#(\w)$/);
      if (priorityMatcher) {
        priority = priorityMatcher[1];
        continue;
      }
    }

    while (title) {
      const argMatcher = title.match(/^(.*)\s+\[(.*)\]\s*$/);
      if (!argMatcher) break;
      title = argMatcher[1];
    }

    if (level == 1) {
      const area = new Area(this.document);
      area.originTitle = title;
      this._stackPush(level, area);
    }
    else {
      const area = this._stackArea();
      if (area) {
        const task = new Task(this.document, area, this._stackTask());
        if (title) task.originTitle = title;
        if (category) task.originCategory = category;
        if (members) task.originMembers = members;
        if (tags) task.originTags = tags;
        if (category) task.originCategory = category;
        if (state) task.originState = state;
        if (priority) task.originPriority = priority;
        this._stackPush(level, task);
      }
    }
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

