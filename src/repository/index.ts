import { normalize, strings } from '@angular-devkit/core';
import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { ProjectType, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { Schema as RepositorySchema } from './schema';

export function generate(options: RepositorySchema): Rule {
  return (tree: Tree) => {
    // parse workspace string into JSON object
    const workspace: WorkspaceSchema = options.env === 'test' ? getWorkspaceForTestEnvironment() : getWorkspace(tree);

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
    const [targetName, targetPath] = getAdjustNameAndPath(options.name, options.path);

    const templateSource = apply(url('./files'), [applyTemplates({ ...strings, name: targetName }), move(normalize(targetPath as string))]);
    return chain([mergeWith(templateSource)]);
  };
}

function getWorkspace(tree: Tree): WorkspaceSchema {
  const workspaceConfig = tree.read('/angular.json');
  if (!workspaceConfig) {
    throw new SchematicsException('Could not find Angular workspace configuration');
  }

  // convert workspace to string
  const workspaceContent = workspaceConfig.toString();

  // parse workspace string into JSON object
  return JSON.parse(workspaceContent);
}

function getWorkspaceForTestEnvironment(): WorkspaceSchema {
  return {
    projects: {
      'ng-schematics': { projectType: ProjectType.Application, sourceRoot: 'src', root: '', prefix: 'app' },
    },
    defaultProject: 'ng-schematics',
    version: 1,
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
