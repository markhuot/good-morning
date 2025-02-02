<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    @vite(['resources/css/app.css'])
</head>
<body>
    <div id="app"></div>
    <script>
        @php
            $vars = collect(get_defined_vars())
                ->filter(fn ($_, $key) => !str_starts_with($key, '_'))
                ->filter(fn ($_, $key) => $key !== 'app')
                ->toJson();
        @endphp
        const vars = {
            'component': 'index.tsx',
            ...JSON.parse('{!! addslashes($vars) !!}')
        };

        const proxy = new Proxy(vars, {
            get(target, prop) {
                return target[prop];
            }
        })
    </script>
    @vite(['resources/js/app.js'])
</body>
</html>
