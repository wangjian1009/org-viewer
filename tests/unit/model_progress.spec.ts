import chai from 'chai';
import { Document, Task } from '../../src/model'
import { OrgParser } from '../../src/model/OrgParser'

const should = chai.should();

describe("model.task.progress", function() {
    var document: Document;

    function buildTask(def: string): Task {
        document = OrgParser.parseNewDocument(
            `#+TODO: TODO | DONE
* Area
${def}
`);
        const task = document.findTaskByLocalId("1");
        should.exist(task);
        return task!;
    }

    this.afterEach(() => {
        if (document) {
            document.dispose();
        }
    });

    it('only', function(done) {
        const task = buildTask(`** TODO Task1.1`);
        [0, 1].should.deep.equal(task.taskCount);
        done();
    });
});


