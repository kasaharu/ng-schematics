import { normalize, strings, workspaces } from '@angular-devkit/core';
import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { createHost } from '../utilities/create-host';
import { Schema as NgRxStoreSchema } from './schema';


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
