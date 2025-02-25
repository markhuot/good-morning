import './bootstrap';

import React from 'react';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { setRequestHandler } from '@markhuot/synapse/php';

setRequestHandler(async (options) => {
  return router.post(options.url, options.body, {...options, preserveScroll: true});

  // const response = await axios.post(options.url, options.body, options);
  // return response.data;
})

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('../pages/**/*.tsx', { eager: true });
    return pages[`../pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
})
