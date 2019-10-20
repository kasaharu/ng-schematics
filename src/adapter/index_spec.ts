import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

const fileName = 'hello-world';
const generatedFileName = '/hello-world.adapter.ts';
const generatedSpecFileName = '/hello-world.adapter.spec.ts';

const generatedFile = `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelloWorldAdapter {
  constructor() {}
}`;

const generatedSpecFile = `import { TestBed } from '@angular/core/testing';
import { HelloWorldAdapter } from './hello-world.adapter';

describe('HelloWorldAdapter', () => {
  let adapter: HelloWorldAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    adapter = TestBed.inject(HelloWorldAdapter);
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });
});`;

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

  it('生成される実装ファイルの内容確認', () => {
    expect(tree.readContent(generatedFileName)).toBe(generatedFile);
  });

  it('生成されるテストファイルの内容確認', () => {
    expect(tree.readContent(generatedSpecFileName)).toBe(generatedSpecFile);
  });
});
