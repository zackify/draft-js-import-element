/* @flow */
const {describe, it} = global;
import expect from 'expect';
import stateFromElement from '../stateFromElement';
import {
  TextNode,
  ElementNode,
} from 'synthetic-dom';
import {convertToRaw} from 'draft-js';
import {jsdom} from 'jsdom';
import fs from 'fs';
import {join} from 'path';

let document = jsdom('<!doctype html><html><body></body></html>');

// This separates the test cases in `data/test-cases.txt`.
const SEP = '\n\n#';

let testCasesRaw = fs.readFileSync(
  join(__dirname, '..', '..', 'test', 'test-cases.txt'),
  'utf8',
);

let testCases = testCasesRaw.slice(1).trim().split(SEP).map((text) => {
  let lines = text.split('\n');
  let description = lines.shift().trim();
  let state = removeBlockKeys(JSON.parse(lines[0]));
  let html = lines.slice(1).join('\n');
  return {description, state, html};
});

describe('stateFromElement', () => {
  let textNode = new TextNode('Hello World');
  let element = new ElementNode('div', [], [textNode]);
  it('should create content state', () => {
    let contentState = stateFromElement(element);
    let rawContentState = removeBlockKeys(convertToRaw(contentState));
    expect(rawContentState).toEqual(
      {entityMap: {}, blocks: [{text: 'Hello World', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: []}]}
    );
  });
});

describe('stateFromHTML', () => {
  testCases.forEach((testCase) => {
    let {description, state, html} = testCase;
    it(`should render ${description}`, () => {
      let element = parseHTML(html);
      let actualState = removeBlockKeys(
        convertToRaw(stateFromElement(element))
      );
      expect(actualState).toEqual(state);
    });
  });
});

function parseHTML(html: string): Element {
  document.documentElement.innerHTML = html;
  let body: Element = document.body;
  return body;
}

function removeBlockKeys(content: Object): Object {
  let newContent = {...content};
  newContent.blocks = content.blocks.map((block) => {
    let {key, ...other} = block;
    return other;
  });
  return newContent;
}
