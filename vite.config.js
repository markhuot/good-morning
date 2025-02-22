import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import {synapse} from '@markhuot/synapse/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        synapse(),
    ],
});
