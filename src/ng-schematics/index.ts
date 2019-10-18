import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  branchAndMerge,
  mergeWith,
  template,
  url,
} from '@angular-devkit/schematics';
// import { Schema as ClassOptions } from './schema';

export function generateAdapter(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    if (!options.name) {
      throw new SchematicsException('Option (name) is required.');
    }

    const templateSource = apply(url('./files/adapters'), [
      template({
        ...strings,
        ...options,
      }),
    ]);

    return branchAndMerge(mergeWith(templateSource));
  };
}
