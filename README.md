# ng-schematics

このリポジトリは Angular アプリケーション用の Custom Schematics です。

# Use

## Install

```bash
$ yarn add @kasaharu/ng-schematics -D
```

## Generate NgRx Store by this schematics

- Generate 2 files `src/app/features/store/hello.store.ts` and `src/app/features/store/hello.store.spec.ts`

```bash
$ yarn ng-schematics ngrx-store --name features/store/hello
```

- If multiple projects,

```bash
$ yarn ng-schematics ngrx-store --name features/store/hello --project other-app
```

# Development

## build and use

```bash
$ yarn build
$ yarn schematics .:ngrx-store --name features/store/hello --debug false
```

## test

```bash
$ yarn test
```
