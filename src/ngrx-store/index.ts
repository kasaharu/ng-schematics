import { experimental, normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { Schema as NgRxStoreSchema } from './schema';

export function ngRxStore(options: NgRxStoreSchema): Rule {
  return (tree: Tree) => {
    // parse workspace string into JSON object
    const workspace: experimental.workspace.WorkspaceSchema = getWorkspace(tree);
    if (!options.project) {
      options.project = workspace.defaultProject;
    }

    const projectName = options.project as string;

    const project = workspace.projects[projectName];

    const projectType = project.projectType === 'application' ? 'app' : 'lib';

    if (options.path === undefined) {
      options.path = `${project.sourceRoot}/${projectType}`;
    }

    // NOTE: 渡された name がパス付きになっていた場合パス部分を path として変換し最後の名前を name に残す
    const splitedName = options.name.split('/');
    const hasPathInName = splitedName.length >= 2;
    const lastIndex = splitedName.length - 1;

    const targetName = !hasPathInName ? options.name : splitedName[lastIndex];
    const targetPath = !hasPathInName ? options.path : `${options.path}/${splitedName.filter((_, index) => index !== lastIndex).join('/')}`;

    const templateSource = apply(url('./files'), [
      applyTemplates({
        camelize: strings.camelize,
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: targetName,
      }),
      move(normalize(targetPath as string)),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}

function getWorkspace(tree: Tree): experimental.workspace.WorkspaceSchema {
  const workspaceConfig = tree.read('/angular.json');
  if (!workspaceConfig) {
    throw new SchematicsException('Could not find Angular workspace configuration');
  }

  // convert workspace to string
  const workspaceContent = workspaceConfig.toString();

  // parse workspace string into JSON object
  return JSON.parse(workspaceContent);
}
