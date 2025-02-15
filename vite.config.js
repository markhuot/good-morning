import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { createFilter } from '@rollup/pluginutils';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
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

                    if (code.indexOf('php`') === -1) {
                        return {
                            code,
                            map: null,
                        };
                    }

                    const relativeId = path.relative(viteRoot, id);
                    code = parseCodeForTaggedStrings(code, relativeId);

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

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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

namespace App\\Handlers;

class Handle_${hash}
{
    public function __invoke(...$params)
    {
        ${code}
    }
}
    `.trim() + "\n";
}
