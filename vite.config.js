import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { createFilter } from '@rollup/pluginutils';
import * as fs from 'fs';
import * as path from 'path';
import {simple} from 'acorn-walk';
import {generate} from 'astring';
import { arrayBuffer } from 'stream/consumers';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        (function (options={}) {
            const filter = createFilter(
                options.include || [],
                options.exclude || [/node_modules/],
            );

            let viteRoot = '';

            return {
                name: 'transform-php',
                configResolved(config) {
                    viteRoot = config.root;
                },
                transform(code, id) {
                    if (!filter(id)) return;

                    // temp scope
                    if (!id.match(/AddTodo\.tsx$/)) {
                        return {
                            code,
                            map: null,
                        }
                    }

                    if (code.indexOf('php`') === -1) {
                        return {
                            code,
                            map: null,
                        };
                    }

                    //console.log(id);
                    let tagIndex = 0;
                    const ast = this.parse(code);
                    console.log(ast.body[2].declarations);
                    simple(ast, {
                        ImportDeclaration(node) {
                            // check if the php import is renamed
                            // console.log(node);
                        },
                        TaggedTemplateExpression(node) {
                            if (node.tag.name === 'php') {
                                //console.log(generate(node));
                                const hash = generateFilesystemSafeHash(`${id}-${tagIndex++}`);
                                const phpCodeBlocks = node.quasi.quasis.map(element => generate(element));

                                writePhp(hash, phpCodeBlocks.flatMap((item, index) => {
                                    if (index < phpCodeBlocks.length - 1) {
                                        return [item, `$variable${index}`];
                                    }

                                    return [item];
                                }).join(''));

                                node.quasi.quasis = node.quasi.quasis.map((quasi, index) => {
                                    return {
                                        ...quasi,
                                        value: {
                                            cooked: index === 0 ? hash : '',
                                            raw: index === 0 ? hash : '',
                                        }
                                    }
                                });

                            }
                        },
                        CallExpression(node) {
                            if (node.callee.type === 'Identifier' && node.callee.name === 'compose') {
                                //console.log(node.arguments);
                            }
                        }
                    });
                    code = generate(ast, {comments: true});

                    // const relativeId = path.relative(viteRoot, id);
                    // code = parseCodeForTaggedStrings(code, relativeId);

                    return {
                        code,
                        map: null,
                    };
                }
            }
        })(),
    ],
});

function parseCodeForTaggedStrings(code, id) {
    let javascriptCode = '';
    let phpCode = '';
    let templateStringCount = 0
    let inTemplateString = false;
    let variableCount = 0;
    let inInterpolation = false;
    let braceCount = 0;

    for (let i = 0; i < code.length; i++) {
        if (code.slice(i, i + 4) === 'php`' && !inTemplateString) {
            inTemplateString = generateFilesystemSafeHash(`${id}-${templateStringCount++}`);
            javascriptCode += 'php`' + inTemplateString;
            phpCode = '';
            variableCount = 0;
            i += 3;
            continue;
        }

        if (inTemplateString) {
            if (code.slice(i, i + 2) === '${' && !inInterpolation) {
                inInterpolation = true;
                braceCount = 1;
                javascriptCode += '${';
                phpCode += `$params[${variableCount++}]`;
                i += 1;
                continue;
            }

            if (inInterpolation) {
                if (code[i] === '{') {
                    braceCount++;
                } else if (code[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        inInterpolation = false;
                    }
                }
                javascriptCode += code[i];
                continue;
            }

            if (code[i] === '`') {
                writePhp(inTemplateString, phpCode);
                inTemplateString = false;
                javascriptCode += '`';
                continue;
            }

            else {
                phpCode += code[i];
            }
        }

        if (! inTemplateString) {
            javascriptCode += code[i];
        }
    }

    return javascriptCode;
}

function writePhp(hash, code) {
    const filePath = path.join(__dirname, 'app', 'Handlers', `Handle_${hash}.php`);

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, getPhpSkeleton(hash, code), { encoding: 'utf8' });
}

function generateFilesystemSafeHash(input) {
    let hash = 5381;
    for (let i = 0; i < input.length; i++) {
        hash = (hash * 33) ^ input.charCodeAt(i);
    }
    return (hash >>> 0).toString(36);
}

function getPhpSkeleton(hash, code) {
    return `
<?php

${code}
`.trim() + "\n";
}
