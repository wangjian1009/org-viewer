import chai from 'chai';
import { Document, Area, Task, TagType } from '../../src/model'
import { OrgParser } from '../../src/model/OrgParser'

const should = chai.should();

describe("model.parse", function() {
  var document: Document;

  this.beforeAll(function() {
    document = OrgParser.parseNewDocument(
      `#+TITLE: 测试文档
:PROPERTIES:
#+SEQ_TODO: TODO(t) NEXT(n!) SOMEDAY(s!) INPROGRESS(p!) WAITTING(w@/!) | DONE(d@/!) ABORT(a@/!)
#+TAGS:
#+TAGS: Member1(l) Member2(c) Member3(s) Member4(x)
#+TAGS: PROJECT(p) REQUIREMENT(r) BUG(b) VERSION(v)
#+TAGS: Other1 Other2
#+TAGS: Other3
:END:
* Area1 [1/2]
** TODO [#C] Task1.1    :Member1:Member2:Other1:Other3:BUG:
:PROPERTIES:
:ID:       DC7F5E66-20E3-42DA-BE24-172E670ED505
:COOKIE_DATA: todo recursive
:END:
SCHEDULED: <2020-02-03 Mon> DEADLINE: <2020-02-15 Sat>
*** Task1.1.1
** Task1.2
* Area2
*** Task2.1
`);
  });

  this.afterAll(() => {
    document.dispose();
  });

  it('document title ok', function(done) {
    "测试文档".should.equal(document.title);
    done();
  });

  it('document members ok', function(done) {
    ["Member1", "Member2", "Member3", "Member4"]
      .should.deep.equal(document.tags(TagType.Member).map((tag) => tag.name));
    done();
  });

  it('document categories ok', function(done) {
    ["PROJECT", "REQUIREMENT", "BUG", "VERSION"]
      .should.deep.equal(document.tags(TagType.Category).map((tag) => tag.name));
    done();
  });

  it('document states ok', function(done) {
    ["TODO", "NEXT", "SOMEDAY", "INPROGRESS", "WAITTING", "DONE", "ABORT"]
      .should.deep.equal(document.states.map((state) => state.name));
    done();
  });

  it('document done state ok', function(done) {
    const stateDoneDft = document.stateDoneDft;
    should.exist(stateDoneDft);
    stateDoneDft!.name.should.equal("DONE");
    done();
  });

  it('document todo state ok', function(done) {
    const stateTodoDft = document.stateTodoDft;
    should.exist(stateTodoDft);
    stateTodoDft!.name.should.equal("TODO");
    done();
  });

  it('document process state ok', function(done) {
    const stateProcessDft = document.stateProcessDft;
    should.exist(stateProcessDft);
    stateProcessDft!.name.should.equal("INPROGRESS");
    done();
  });

  it('document waiting state ok', function(done) {
    const stateWaitingDft = document.stateWaitingDft;
    should.exist(stateWaitingDft);
    stateWaitingDft!.name.should.equal("WAITTING");
    done();
  });

  it('document have connrect struct', function(done) {
    ['Area1', 'Area2'].should.deep.equal(document.areas.map((area) => area.title));
    done();
  });

  describe("area1", function() {
    var area1: Area;

    this.beforeAll(function() {
      const found = document.findArea("Area1");
      should.exist(found);
      if (found) area1 = found;
    });

    it('should have correct struct', function(done) {
      ['Task1.1', 'Task1.2'].should.deep.equal(area1.rootTasks.map((task) => task.title));
      done();
    });
  });

  describe("task1.1", function() {
    var task: Task;

    this.beforeAll(function() {
      const found = document.findTaskByPersistentId("DC7F5E66-20E3-42DA-BE24-172E670ED505");
      should.exist(found);
      if (found) task = found;
    });

    it('should title ok', function(done) {
      "Task1.1".should.equal(task.title);
      done();
    });

    it('should have members', function(done) {
      ['Member1', 'Member2'].should.deep.equal(task.members.map((member) => member.name));
      done();
    });

    it('should have tags', function(done) {
      ['Other1', 'Other3'].should.deep.equal(task.tags.map((tag) => tag.name));
      done();
    });

    it('should have category', function(done) {
      const category = task.category;
      should.exist(category);
      if (category) {
        category.name.should.equal("BUG");
      }
      done();
    });

    it('should priority ok', function(done) {
      "C".should.equal(task.priority);
      done();
    });

    it('should have state', function(done) {
      const state = task.state;
      should.exist(state);
      if (state) {
        state.name.should.equal("TODO");
      }
      done();
    });

    it('should have scheduled', function(done) {
      const scheduledDate = task.scheduled;
      should.exist(scheduledDate);
      if (scheduledDate) {
        scheduledDate.should.deep.equal(new Date(2020, 2, 3));
      }
      done();
    });

    it('should have deadline', function(done) {
      const deadlineDate = task.deadline;
      should.exist(deadlineDate);
      if (deadlineDate) {
        deadlineDate.should.deep.equal(new Date(2020, 2, 15));
      }
      done();
    });
  });
});


