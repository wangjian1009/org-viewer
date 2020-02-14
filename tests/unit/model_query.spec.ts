import chai from 'chai';
import { Document, Searcher, ResultNode } from '../../src/model'
import { OrgParser } from '../../src/model/OrgParser'

const should = chai.should();

describe("model.query", function() {
    describe("basic", function() {
        var document: Document;
        var searcher: Searcher;

        this.beforeAll(function() {
            document = OrgParser.parseNewDocument(
                `* Area1
** Task1.1
*** Task1.1.1
** Task1.2
* Area2
*** Task2.1
`);
        });

        this.beforeEach(function() {
            searcher = new Searcher(document);
        });

        it("not search should no result", function(done) {
            searchResults(searcher).should.deep.equal([]);
            done();
        });

        describe("with area", function() {
            this.beforeEach(function() {
                searcher.includeArea = true;
            });

            it("full query", function(done) {
                searcher.go();
                [['Area1',
                    [['Task1.1', ['Task1.1.1']]
                        , 'Task1.2'
                    ]
                ],
                ['Area2',
                    ['Task2.1']]
                ].should.deep.equal(searchResults(searcher));
                done();
            });
        });

        describe("without area", function() {
            this.beforeEach(function() {
                searcher.includeArea = false;
            });

            it("full query", function(done) {
                searcher.go();
                [['Task1.1', ['Task1.1.1']]
                    , 'Task1.2'
                    , 'Task2.1'
                ].should.deep.equal(
                    searchResults(searcher)
                );
                done();
            });
        });
    });
});


function searchResults(searcher: Searcher): any[] {
    const results: any[] = [];

    if (searcher.result) {
        for (const child of searcher.result.childs) {
            results.push(searchNodeResults(child));
        }
    }

    return results;
}

function searchNodeResults(node: ResultNode): any {
    if (node.childs.length > 0) {
        const childs: any[] = [];
        for (const child of node.childs) {
            childs.push(searchNodeResults(child));
        }
        return [node.value.title, childs];
    }
    else {
        return node.value.title;
    }
}
