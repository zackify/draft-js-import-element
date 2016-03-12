/* @flow */
const {describe, it} = global;
import expect from 'expect';
import stateFromElement from '../stateFromElement';
import {
  TextNode,
  ElementNode,
} from 'synthetic-dom';
import {convertToRaw} from 'draft-js';

describe('stateFromElement', () => {
  let textNode = new TextNode('Hello World');
  let element = new ElementNode('div', [], [textNode]);
  it('should create content state', () => {
    let contentState = stateFromElement(element);
    let rawContentState = convertToRaw(contentState);
    let blocks = removeKeys(rawContentState.blocks);
    expect(blocks).toEqual(
      [{text: 'Hello World', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: []}]
    );
  });
});

function removeKeys(blocks) {
  return blocks.map((block) => {
    let {key, ...other} = block;
    return other;
  });
}
