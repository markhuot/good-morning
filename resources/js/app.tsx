import './bootstrap';

import React from 'react';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import {setPhpCallback} from './php'

setPhpCallback((options) => router.post(options.url, options.body))

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true });
    return pages[`../pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
})
