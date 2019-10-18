// import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
//
// // You don't have to export the function as default. You can also have more than one rule factory
// // per file.
// export function ngSchematics(_options: any): Rule {
//   return (tree: Tree, _context: SchematicContext) => {
//     return tree;
//   };
// }

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

export function ngSchematics(options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    if (!options.name) {
      throw new SchematicsException('Option (name) is required.');
    }

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...options,
      }),
    ]);

    return branchAndMerge(mergeWith(templateSource));
  };
}
