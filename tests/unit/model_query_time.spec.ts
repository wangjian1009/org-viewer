import chai from 'chai';
import { Searcher } from '../../src/model';
import { OrgParser } from '../../src/model/OrgParser';
import moment from 'moment';

chai.should();

describe("model.query.time", function() {
  it("no scheduled should ignore", function(done) {
    queryByTimeRange(`** TODO T1`, [2020, 2, 16], undefined)
      .should.deep.equals([]);
    done();
  });

  it("scheduled not complete should found", function(done) {
    queryByTimeRange(`** TODO T1
SCHEDULED: <2020-02-16 Wed>`, [2020, 2, 16], undefined)
      .should.deep.equals(["T1"]);
    done();
  });

  it("scheduled after start should not found", function(done) {
    queryByTimeRange(`** TODO T1
SCHEDULED: <2020-02-17 Wed>`, [2020, 2, 16], undefined)
      .should.deep.equals([]);
    done();
  });

  it("done before start should not found", function(done) {
    queryByTimeRange(`** DONE T1
SCHEDULED: <2020-02-15 Wed>`, [2020, 2, 16], undefined)
      .should.deep.equals([]);
    done();
  });

  it("done at start should found", function(done) {
    queryByTimeRange(`** DONE T1
SCHEDULED: <2020-02-16 Wed>`, [2020, 2, 16], undefined)
      .should.deep.equals(['T1']);
    done();
  });
});

function queryByTimeRange(taskDef: string, begin: number[] | undefined, end: number[] | undefined): string[] {
  const document = OrgParser.parseNewDocument(
    `#+TODO: TODO | DONE
* Area1
${taskDef}`);
  const searcher = new Searcher(document);

  searcher.dateRangeBegin = begin ? moment(begin).toDate() : undefined;
  searcher.dateRangeEnd = end ? moment(end).toDate() : undefined;
  searcher.go();

  var result: string[] | undefined;

  if (searcher.result) {
    result = searcher.result.childs.map((node) => node.value.title!);
  }

  document.dispose();

  return result ? result : [];
}
