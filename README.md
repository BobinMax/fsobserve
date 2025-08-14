# @bobinmax/ftree
````markdown

A versatile and lightweight Node.js module to scan a directory and return its structure as a nested object, a flat array of paths, or a JSON string.

## Installation

Install the package using npm:

```bash
npm install @bobinmax/ftree
````

## Usage

`@bobinmax/ftree` exports three separate functions to get the directory structure in your desired format.

### `getTreeAsObject(path)`

Returns a nested JavaScript object representing the full directory tree. This is useful for programmatic traversal and manipulation.

```javascript
const { getTreeAsObject } = require('@bobinmax/ftree');

const tree = getTreeAsObject('./src');

console.dir(tree, { depth: null });

/*
Example Output:
{
  path: 'src',
  name: 'src',
  isDirectory: true,
  children: [
    {
      path: 'src/components',
      name: 'components',
      isDirectory: true,
      children: [
        {
          path: 'src/components/Button.js',
          name: 'Button.js',
          isDirectory: false
        }
      ]
    },
    {
      path: 'src/index.js',
      name: 'index.js',
      isDirectory: false
    }
  ]
}
*/
```

### `getTreeAsArray(path)`

Returns a simple, flat array containing the full paths of every file and directory within the target path.

```javascript
const { getTreeAsArray } = require('@bobinmax/ftree');

const paths = getTreeAsArray('./src');

console.log(paths);

/*
Example Output:
[
  'src/components',
  'src/components/Button.js',
  'src/index.js'
]
*/
```

### `getTreeAsJson(path, pretty = false)`

Returns a JSON string representation of the nested directory tree. Set the optional second argument to `true` for pretty-printing.

```javascript
const { getTreeAsJson } = require('@bobinmax/ftree');

// Get a minified JSON string
const jsonString = getTreeAsJson('./src');

// Get a formatted (pretty-printed) JSON string
const prettyJsonString = getTreeAsJson('./src', true);

console.log(prettyJsonString);
```

## API

  * **`getTreeAsObject(rootPath)`**

      * `rootPath` `<string>`: The path to the directory you want to scan.
      * Returns `<object>`: A nested object representing the directory structure.

  * **`getTreeAsArray(rootPath)`**

      * `rootPath` `<string>`: The path to the directory you want to scan.
      * Returns `<string[]>`: A flat array of all paths.

  * **`getTreeAsJson(rootPath, [pretty])`**

      * `rootPath` `<string>`: The path to the directory you want to scan.
      * `pretty` `<boolean>`: (Optional) If `true`, the output JSON will be formatted with an indent of 2 spaces. Defaults to `false`.
      * Returns `<string>`: The directory tree as a JSON string.

## License

ISC

```
```