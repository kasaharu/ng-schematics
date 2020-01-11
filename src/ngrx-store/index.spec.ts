import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

const fileName = 'hello-world';
const generatedFileName = '/src/app/hello-world.store.ts';
const generatedSpecFileName = '/src/app/hello-world.store.spec.ts';

const generatedFile = `import { createAction, createReducer, on, props, union } from '@ngrx/store';

// NOTE: State
export interface State {
  helloWorld: any | null;
}

export const initialState: State = {
  helloWorld: null,
};

// NOTE: Actions
export const saveHelloWorld = createAction('[HelloWorld] save', props<{ helloWorld: any }>());

export const actions = { saveHelloWorld };
const actionsUnion = union(actions);

// NOTE: Reducer
const helloWorldReducer = createReducer(initialState, on(saveHelloWorld, (state, { helloWorld }) => ({ ...state, helloWorld })));

export default function reducer(state: State, action: typeof actionsUnion): State {
  return helloWorldReducer(state, action);
}

// NOTE: Selectors
export const featureName = 'helloWorld';
`;

const generatedSpecFile = `import reducer, { actions, State } from './hello-world.store';

describe('helloWorld reducer', () => {
  it('action type : saveHelloWorld', () => {
    const state: State = { helloWorld: null };
    const updatedState = null;
    const result = reducer(state, actions.saveHelloWorld({ helloWorld: updatedState }));

    expect(result).toEqual({ helloWorld: updatedState });
  });
});
`;

describe('ngrx-store', () => {
  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(() => {
    const args = { name: fileName, env: 'test' };
    runner = new SchematicTestRunner('schematics', collectionPath);
    tree = runner.runSchematic('ngrx-store', args, Tree.empty());
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
