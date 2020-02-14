import chai from 'chai';
import { Document } from '../../src/model'
import { OrgParser } from '../../src/model/OrgParser'

const should = chai.should();

describe("model", function() {
    var document: Document;

    this.beforeAll(function() {
        document = OrgParser.parseNewDocument(
            `#+TITLE: 测试文档
* Area1
** Task1.1
`);
    });

    this.afterAll(() => {
        document.dispose();
    });

    it('basic', (done) => {
        should.equal(document.title, "测试文档");
        done();
    });
});


