import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

const fileName = 'hello-world';
const generatedFileName = '/hello-world.adapter.ts';
const generatedSpecFileName = '/hello-world.adapter.spec.ts';

describe('adapter', () => {
  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(() => {
    const args = { name: fileName };

    runner = new SchematicTestRunner('schematics', collectionPath);
    tree = runner.runSchematic('adapter', args, Tree.empty());
  });

  it('生成されるファイル名の確認', () => {
    const outputFileList = [generatedSpecFileName, generatedFileName];
    expect(tree.files).toEqual(outputFileList);
  });
});
