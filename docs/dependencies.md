# Updating dependencies

[**Previous:** Markdown styleguide](./markdown.md) 

---

It's good practice to update the dependencies of these projects from time to
time as security issues might arise from them otherwise.

## Checking for outdated dependencies

To check for outdated dependencies, first pull all the latest changes and then
use `yarn` to check for them. Make sure you are on the `main` branch when
checking for dependencies.

```sh
git checkout main
git pull
yarn outdated
```

The result will look something like this.

```sh
yarn outdated v1.22.4
info Color legend : 
 "<red>"    : Major Update backward-incompatible updates 
 "<yellow>" : Minor Update backward-compatible features 
 "<green>"  : Patch Update backward-compatible bug fixes
Package Current Wanted Latest Package Type    URL   
axios   2.0.1   2.0.1  1.3.4  devDependencies https://github.com/axios/axios
jest    26.4.2  26.5.2 26.5.2 dependencies    https://jestjs.io/
✨  Done in 1.25s.
```

## Automatic upgrades

To automatically upgrade any packages that can be upgraded without any backwards
incompatible changes, use `yarn upgrade`. Then run `yarn outdated` again to check
for any remaining upgrades.

It's recommended to run `yarn lint` before and after the upgrade to make sure
tests are unaffected by the change.

```sh
yarn lint
yarn upgrade
yarn outdated
yarn lint
```

## Manual upgrades

To manually apply a major or minor change, inspect the output of `yarn outdated`
and use `yarn add <name>@^<version> [--dev]` to add the new version of the
package.

```sh
yarn lint
yarn add axios@^2.0.1 --dev
yarn add jest@^26.4.2
yarn outdated
yarn lint
```

Make sure to use `^` to allow packages to be upgrade to a higher patch version
in a later upgrade, and make sure to add `--dev` for any dependencies marked as
`devDependencies`.

Again, it's recommended to run `yarn lint` before and after the upgrade to make sure
tests are unaffected by the change.
