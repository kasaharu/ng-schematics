import { normalize, strings, virtualFs, workspaces } from '@angular-devkit/core';
import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { Schema as NgRxStoreSchema } from './schema';

export function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

export function ngRxStore(options: NgRxStoreSchema): Rule {
  return async (tree: Tree) => {
    const host = createHost(tree);
    const { workspace } = await workspaces.readWorkspace('/', host);

    if (!options.project) {
      options.project = workspace.extensions['defaultProject'] as string;
    }

    const project = workspace.projects.get(options.project);
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }

    const projectType = project.extensions['projectType'] === 'application' ? 'app' : 'lib';

    if (options.path === undefined) {
      options.path = `${project.sourceRoot}/${projectType}`;
    }

    // NOTE: 渡された name がパス付きになっていた場合パス部分を path として変換し最後の名前を name に残す
    const [targetName, targetPath] = getAdjustNameAndPath(options.name, options.path);

    const templateSource = apply(url('./files'), [applyTemplates({ ...strings, name: targetName }), move(normalize(targetPath as string))]);
    return chain([mergeWith(templateSource)]);
  };
}

function getAdjustNameAndPath(originalName: string, originalPath: string): string[] {
  const splitedName = originalName.split('/');
  const hasPathInName = splitedName.length >= 2;
  const lastIndex = splitedName.length - 1;

  const adjustName = !hasPathInName ? originalName : splitedName[lastIndex];
  const adjustPath = !hasPathInName ? originalPath : `${originalPath}/${splitedName.filter((_, index) => index !== lastIndex).join('/')}`;

  return [adjustName, adjustPath];
}
