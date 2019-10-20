import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('adapter', () => {
  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const args = { name: 'hello-world' };
    const tree = runner.runSchematic('adapter', args, Tree.empty());

    const outputFileList = ['/hello-world.adapter.spec.ts', '/hello-world.adapter.ts'];
    expect(tree.files).toEqual(outputFileList);
  });
});
