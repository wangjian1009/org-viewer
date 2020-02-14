import chai from 'chai';
import { Document, Area, Task } from '../../src/model'
import { OrgParser } from '../../src/model/OrgParser'

const should = chai.should();

describe("model.basic", function() {
    var document: Document;

    this.beforeAll(function() {
        document = OrgParser.parseNewDocument(
            `#+TITLE: 测试文档
* Area1
** Task1.1
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
        should.equal(document.title, "测试文档");
        done();
    });

    it('document have connrect struct', function(done) {
        document.areas.map((area) => area.title).should.deep.equal(['Area1', 'Area2']);
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
            area1.rootTasks.map((task) => task.title).should.deep.equal(['Task1.1', 'Task1.2']);
            done();
        });
    });
});


