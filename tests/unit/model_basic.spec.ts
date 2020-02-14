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
:PROPERTIES:
:ID:       DC7F5E66-20E3-42DA-BE24-172E670ED505
:COOKIE_DATA: todo recursive
:END:
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
});


