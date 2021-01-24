export function detectNameAndPath(originalName: string, originalPath: string): { name: string, path: string } {
  const splitedName = originalName.split('/');
  const hasPathInName = splitedName.length >= 2;
  const lastIndex = splitedName.length - 1;

  const adjustName = !hasPathInName ? originalName : splitedName[lastIndex];
  const adjustPath = !hasPathInName ? originalPath : `${originalPath}/${splitedName.filter((_, index) => index !== lastIndex).join('/')}`;

  return { name: adjustName, path: adjustPath };
}
