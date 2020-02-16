import chai from 'chai';
import { Searcher } from '../../src/model';
import { OrgParser } from '../../src/model/OrgParser';
import moment, { Moment } from 'moment';

chai.should();

describe("model.query.time", function() {
  const checkDate = moment('2020-02-16');
  const caseGroup: [string, Moment | undefined, Moment | undefined][] = [
    ["start", checkDate, undefined],
    ["end", undefined, checkDate],
    ["ragne", checkDate, checkDate]
  ];

  for (const testCase of caseGroup) {
    describe(testCase[0], function() {
      it("no scheduled should ignore", function(done) {
        queryByTimeRange(`** TODO T1`, testCase[1], testCase[2])
          .should.deep.equals([]);
        done();
      });

      it("todo at check should found", function(done) {
        queryByTimeRange(`** TODO T1
SCHEDULED: <2020-02-16 Wed>`, testCase[1], testCase[2])
          .should.deep.equals(["T1"]);
        done();
      });

      it("todo before check should found", function(done) {
        queryByTimeRange(`** TODO T1
SCHEDULED: <2020-02-15 Wed>`, testCase[1], testCase[2])
          .should.deep.equals(["T1"]);
        done();
      });

      it("todo after check should not found", function(done) {
        queryByTimeRange(`** TODO T1
SCHEDULED: <2020-02-17 Wed>`, testCase[1], testCase[2])
          .should.deep.equals([]);
        done();
      });

      it("done before check should not found", function(done) {
        queryByTimeRange(`** DONE T1
SCHEDULED: <2020-02-15 Wed>`, testCase[1], testCase[2])
          .should.deep.equals([]);
        done();
      });

      it("done at check should found", function(done) {
        queryByTimeRange(`** DONE T1
SCHEDULED: <2020-02-16 Wed>`, testCase[1], testCase[2])
          .should.deep.equals(['T1']);
        done();
      });

      it("done after check should not found", function(done) {
        queryByTimeRange(`** DONE T1
SCHEDULED: <2020-02-17 Wed>`, testCase[1], testCase[2])
          .should.deep.equals([]);
        done();
      });
    });
  }
});

function queryByTimeRange(taskDef: string, begin: Moment | undefined, end: Moment | undefined): string[] {
  const document = OrgParser.parseNewDocument(
    `#+TODO: TODO | DONE
* Area1
${taskDef}`);
  const searcher = new Searcher(document);

  searcher.dateRangeBegin = begin;
  searcher.dateRangeEnd = end;
  searcher.go();

  var result: string[] | undefined;

  if (searcher.result) {
    result = searcher.result.childs.map((node) => node.value.title!);
  }

  document.dispose();

  return result ? result : [];
}
