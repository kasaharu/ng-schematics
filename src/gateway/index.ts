import { normalize, strings, workspaces } from '@angular-devkit/core';
import { apply, applyTemplates, chain, mergeWith, move, Rule, SchematicsException, Tree, url } from '@angular-devkit/schematics';
import { createHost } from '../utilities/create-host';
import { detectNameAndPath } from '../utilities/detect-name-and-path';
import { Schema as GatewaySchema } from './schema';

export function generate(options: GatewaySchema): Rule {
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
    const { name, path } = detectNameAndPath(options.name, options.path);

    const templateSource = apply(url('./files'), [applyTemplates({ ...strings, name }), move(normalize(path))]);
    return chain([mergeWith(templateSource)]);
  };
}
