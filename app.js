// =================================================================================
//  Node.js Pure Directory Tree Module
//
//  This is a pure Node.js module with no CLI functionality. It provides three
//  separate functions to get a directory's structure in different formats.
//
//  Usage:
//  const {
//    getTreeAsObject,
//    getTreeAsArray,
//    getTreeAsJson
//  } = require('./directory_lister.js');
//
//  const treeObj = getTreeAsObject('./path/to/folder');
//  const flatArray = getTreeAsArray('./path/to/folder');
//  const jsonString = getTreeAsJson('./path/to/folder', true);
// =================================================================================

const fs = require('fs');
const path = require('path');

// --- Private Helper Functions ---

/**
 * @private
 * @brief Recursively builds a nested object representing the directory structure.
 * @param {string} dirPath The path to the directory or file to process.
 * @returns {object} A node object.
 */
function _buildTreeObject(dirPath) {
    const node = {
        path: dirPath,
        name: path.basename(dirPath),
    };
    let stats;

    try {
        stats = fs.statSync(dirPath);
    } catch (e) {
        node.error = `[Error: Cannot stat path. ${e.message}]`;
        return node;
    }

    if (stats.isDirectory()) {
        node.isDirectory = true;
        try {
            node.children = fs.readdirSync(dirPath)
                .map(child => _buildTreeObject(path.join(dirPath, child)));
        } catch (e) {
            node.error = `[Error: Cannot read directory. ${e.message}]`;
        }
    } else {
        node.isDirectory = false;
    }
    return node;
}

/**
 * @private
 * @brief Recursively builds a flat array of all paths within a directory.
 * @param {string} dirPath The directory to start scanning from.
 * @param {string[]} fileList The array to accumulate file paths into.
 */
function _buildFlatArray(dirPath, fileList = []) {
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            fileList.push(fullPath);
            if (entry.isDirectory()) {
                _buildFlatArray(fullPath, fileList);
            }
        }
    } catch (e) {
        // If a directory cannot be read, we just stop descending into it.
        // We can optionally push an error marker into the list.
        fileList.push(`[Error reading ${dirPath}: ${e.message}]`);
    }
    return fileList;
}

// --- Public API Functions ---

/**
 * @brief Scans a directory and returns its structure as a nested Object.
 * The object contains the path, name, and a 'children' array for directories.
 * @param {string} rootPath The starting path for the directory scan.
 * @returns {object} The root node of the directory tree object.
 */
function getTreeAsObject(rootPath) {
    const absolutePath = path.resolve(rootPath);
    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Error: Path not found: ${absolutePath}`);
    }
    return _buildTreeObject(absolutePath);
}

/**
 * @brief Scans a directory and returns a flat Array of all file and
 * subdirectory paths.
 * @param {string} rootPath The starting path for the directory scan.
 * @returns {string[]} A flat array containing full paths of all entries.
 */
function getTreeAsArray(rootPath) {
    const absolutePath = path.resolve(rootPath);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isDirectory()) {
        throw new Error(`Error: Path is not a valid directory: ${absolutePath}`);
    }
    return _buildFlatArray(absolutePath);
}

/**
 * @brief Scans a directory and returns its structure as a JSON string.
 * @param {string} rootPath The starting path for the directory scan.
 * @param {boolean} [pretty=false] If true, formats the JSON with indentation.
 * @returns {string} A JSON string representation of the directory tree.
 */
function getTreeAsJson(rootPath, pretty = false) {
    const treeObject = getTreeAsObject(rootPath);
    const indent = pretty ? 2 : 0;
    return JSON.stringify(treeObject, null, indent);
}


// --- Module Exports ---
// We export the three public functions for use in other modules.
module.exports = {
    getTreeAsObject,
    getTreeAsArray,
    getTreeAsJson,
};
