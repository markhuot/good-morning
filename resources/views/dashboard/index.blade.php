<x-layout bodyClass="bg-mesh">
    <div class="mt-[clamp(0px,calc((100vw-1100px)/2),100px)] min-h-screen md:min-h-0 mx-auto max-w-[1100px] bg-white border border-slate-100 border-b-2 border-b-blue-300 rounded-lg overflow-hidden shadow-lg space-y-8 flex items-stretch" x-init="
        const context = new AudioContext();
        audioBuffers = await Promise.all([
            fetch('/sounds/pop.mp3')
                .then(res => res.arrayBuffer())
                .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer)),
            fetch('/sounds/bottle-pop.mp3')
                .then(res => res.arrayBuffer())
                .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer)),
            fetch('/sounds/tada.mp3')
                .then(res => res.arrayBuffer())
                .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer)),
            fetch('/sounds/game-level-complete.mp3')
                .then(res => res.arrayBuffer())
                .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer)),
        ]);

        pop = () => {
            const source = context.createBufferSource();
            const index = Math.random() < 0.1 ? [2,3][Math.floor(Math.random() * 2)] : 0;
            source.buffer = audioBuffers[index];
            source.connect(context.destination);
            source.start();
        }
        unpop = () => {
            const source = context.createBufferSource();
            source.buffer = audioBuffers[1];
            source.connect(context.destination);
            source.start();
        }
    ">
        <div class="flex flex-col md:flex-row flex-grow">
            <div class="md:w-1/2 pb-12">
                <h1 class="flex gap-4 px-10 pt-12 text-lg">
                    <a href="{{ route('dashboard') }}" title="Back to today" class="group hover:text-slate-950">
                        <span class="text-slate-950 font-bold mr-1 group-hover:underline">{{ $date->format('l') }}</span>
                        <span class="text-slate-400">{{ $date->format('M j') }}</span>
                    </a>
                    <div>
                        <a href="{{ route('dashboard', ['date' => $date->subDay()->format('Y-m-d')]) }}" class="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2">&larr;</a>
                        <a href="{{ route('dashboard', ['date' => $date->addDay()->format('Y-m-d')]) }}" class="text-slate-400 hover:text-black hover:bg-slate-100 rounded inline-block px-2">&rarr;</a>
                    </div>
                </h1>
                <ul class="mt-6" @sort="
                    const orderedIds = [...$el.querySelectorAll('& > li')]
                            .map(el => el.dataset.id)
                            .filter(Boolean);
                        axios.post('{{ route('todo.reorder') }}', { orderedIds });
                " x-init="Sortable.create($el, {})">
                    @foreach($todos->where('day', $date->format('Y-m-d'))->get() as $todo)
                        <li data-todo data-id="{{$todo->id}}" x-data='{todo:{{ $todo->toJson() }}}' tabindex="0" class="py-2 px-10 focus:bg-blue-100 focus:outline-none" @keydown="
                            if ($event.key === ' ') {
                                event.preventDefault();
                                $el.querySelector('[data-property=completed]').click();
                            }
                            if ($event.key === 'Enter') {
                                event.preventDefault();
                                $el.querySelector('[data-property=title]').focus();
                            }
                            if ($event.key === 'Delete' || $event.key === 'Backspace') {
                                event.preventDefault();
                                $el.querySelector('[data-property=delete] button').click();
                            }
                            if ($event.key === 'ArrowUp') {
                                event.preventDefault();
                                $el.previousElementSibling?.insertAdjacentElement('beforebegin', $el);
                                $el.focus();
                                $dispatch('sort');
                            }
                            if ($event.key === 'ArrowDown') {
                                event.preventDefault();
                                $el.nextElementSibling?.insertAdjacentElement('afterend', $el);
                                $el.focus();
                                $dispatch('sort');
                            }
                            if ($event.key === 'Tab') {
                                if ($el.previousElementSibling && $event.shiftKey) {
                                    $event.preventDefault();
                                    $el.previousElementSibling?.focus();
                                }
                                if ($el.nextElementSibling && !$event.shiftKey) {
                                    $event.preventDefault();
                                    $el.nextElementSibling?.focus();
                                }
                            }
                        ">
                            <div class="flex">
                                <div class="relative flex-shrink-0 w-[20px] inline-block text-sm mr-1 -top-[2px]">
                                    <ul class="group absolute -top-[3px] -left-[1.3em] hover:bg-white hover:z-50 w-[20px] hover:w-48 hover:shadow-md rounded-lg hover:overflow-hidden">
                                        <li class="px-4 py-2">
                                            <label class="cursor-pointer">
                                                <span class="inline-block w-[20px] h-[20px] relative">
                                                    <x-input data-property="completed" class="peer hidden" type="checkbox" :checked="$todo->completed" @change="
                                                        todo.completed = ! todo.completed;
                                                        const result = await axios.post('{{ route('todo.update', $todo) }}', { _method: 'put', completed: todo.completed })
                                                        todo = result.data;
                                                        todo.completed ? pop() : unpop();
                                                    "/>
                                                    <span class="absolute w-[calc(100%+6px)] h-[calc(100%+6px)] -mt-[3px] -ml-[3px] rounded overflow-hidden">
                                                        <span class="{{$todo->timer_started_at?'inline-block':'hidden'}} absolute w-[200%] h-[200%] -mt-[50%] -ml-[50%] rounded motion-safe:animate-[spin_3s_linear_infinite] bg-gradient-to-b from-transparent via-transparent via-50% to-50% to-blue-200" :class='{"inline-block": todo.timer_started_at, "hidden": ! todo.timer_started_at}'></span>
                                                    </span>
                                                    <span class="hidden peer-[:not(:checked)]:inline-block absolute top-0 left-0 w-full h-full rounded border-2 border-blue-300 bg-white"></span>
                                                    <span class="hidden peer-checked:inline-block absolute top-0 left-0 w-full h-full rounded border-2 border-blue-500 bg-blue-300">
                                                        <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-700 font-bold">&#x2713;</span>
                                                    </span>
                                                </span>
                                                <span class="hidden group-hover:inline">Complete</span>
                                            </label>
                                        </li>
                                        <li class="hidden group-hover:flex justify-between px-4 py-2 hover:bg-slate-100">
                                            <form method="post" action="{{ route($todo->timer_started_at ? 'timer.stop' : 'timer.start', $todo) }}" :action="todo.timer_started_at ? '{{ route('timer.stop', $todo) }}' : '{{ route('timer.start', $todo) }}'">
                                                @csrf
                                                <button class="{{ !$todo->timer_started_at ? 'hidden' : 'inline-block' }}" :class='{"hidden": !todo.timer_started_at, "inline-block": todo.timer_started_at}'><span class="inline-block text-center w-[20px]">&#x23f8;&#xfe0e;</span> Pause</button>
                                                <button class="{{ $todo->timer_started_at ? 'hidden' : 'inline-block' }}" :class='{"hidden": todo.timer_started_at, "inline-block": !todo.timer_started_at}'><span class="inline-block text-center w-[20px]">&#x25B6;</span> Start</button>
                                            </form>
                                            @php
                                                $initialDuration = $todo->getTotalTime()?->forHumans(['parts' => 2, 'short' => true, 'syntax' => \Carbon\CarbonInterface::DIFF_ABSOLUTE]);
                                            @endphp
                                            <span class="text-slate-400" x-data='{time:"{{$initialDuration}}"}' x-text="time" x-init="setInterval(() => time = totalElapsedTime(todo.timer_elapsed, todo.timer_started_at), 1000)">
                                                {{$initialDuration}}
                                            </span>
                                        </li>
                                        <li class="hidden group-hover:block px-4 py-2 hover:bg-slate-100">
                                            <form method="post" action="{{ route('todo.update', $todo) }}">
                                                @csrf
                                                @method('put')
                                                <input type="hidden" name="day" value="{{ $todo->day->addDay()->format('Y-m-d') }}">
                                                <button><span class="inline-block text-center w-[20px]">&rarr;</span> Defer</button>
                                            </form>
                                        </li>
                                        <li class="hidden group-hover:block"><hr></li>
                                        <li class="hidden group-hover:block px-4 py-2 hover:bg-red-100">
                                            <form data-property="delete" method="post" action="{{ route('todo.delete', $todo) }}" @submit="
                                                event.preventDefault();

                                                if (! confirm('Are you sure you want to delete this to-do?')) {
                                                    return;
                                                }

                                                await axios.post('{{ route('todo.delete', $todo) }}', { _method: 'delete' });
                                                $el.closest('[data-todo]').previousElementSibling?.focus();
                                                $el.closest('[data-todo]').remove();
                                            ">
                                                @csrf
                                                @method('delete')
                                                <button class="text-red-500"><span class="inline-block text-center w-[20px]">&#8998;</span> Delete&hellip;</button>
                                            </form>
                                        </li>
                                    </ul>
                                </div>
                                <div class="text-lg {{$todo->completed?'line-through text-slate-500':''}}" :class='{"line-through":todo.completed, "text-slate-500":todo.completed}'>
                                    <div data-property="title" contenteditable @beforeinput="
                                        if ($event.inputType === 'insertParagraph') {
                                            $event.stopPropagation();
                                            $event.preventDefault();
                                        }
                                    " @input.debounce="
                                        axios.put('{{ route('todo.update', $todo) }}', { title: $event.target.innerHTML });
                                    " @keydown="
                                        if (['Delete', 'Backspace', ' ', 'ArrowUp', 'ArrowDown', 'Enter'].includes($event.key)) {
                                            $event.stopPropagation();
                                        }
                                        if ($event.key === 'Escape') {
                                            $el.blur();
                                            $el.closest('[data-todo]').focus();
                                        }
                                    ">{!! $todo->title !!}</div>
                                </div>
                            </div>
                        </li>
                    @endforeach
                </ul>
                <form method="post" action="{{ route('todo.store') }}" class="py-2 px-10">
                    @csrf
                    <input type="hidden" name="date" value="{{ $date->format('Y-m-d') }}">
                    <div>
                        <div class="flex items-baseline relative">
                                <span class="pointer-events-none absolute top-1/2 -translate-y-1/2 inline-block w-[20px] h-[20px] rounded border-dashed border-2 border-blue-200">
                                    <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-[1px] ml-[1px] text-blue-200">&#x002B;</span>
                                </span>
                            <input type="hidden" name="title" value="">
                            <div contenteditable autofocus @beforeinput="
                                    if ($event.inputType === 'insertParagraph') {
                                        $event.stopPropagation();
                                        $event.preventDefault();
                                    }
                                " @input="
                                    $event.target.previousElementSibling.value = $event.target.innerHTML;
                                " @keydown="
                                    if ($event.key === 'Enter') {
                                        $event.stopPropagation();
                                        $event.preventDefault();
                                        $el.closest('form').submit();
                                    }
                                    if (['Delete', 'Backspace', ' ', 'ArrowUp', 'ArrowDown'].includes($event.key)) {
                                        $event.stopPropagation();
                                    }
                                "
                                name="title" placeholder="What's going on?" class="w-full -ml-[0.5em] pl-[calc(20px+1em)] pr-4 py-2"></div>
                        </div>
                        @error('title')
                            <div class="text-red-500">{{ $message }}</div>
                        @enderror
                    </div>
                    <button class="hidden">Add</button>
                </form>
            </div>
            <div class="md:w-1/2 bg-slate-50 relative flex-grow min-h-[50vh]">
                <textarea class="w-full h-full py-14 px-10 bg-transparent peer resize-none" placeholder=" " @input.debounce="
                    axios.post('{{ route('note.store') }}', { date: '{{ $date->format('Y-m-d') }}', contents: $event.target.value })
                ">{{ $notes->where('day', $date->format('Y-m-d'))->first()?->contents }}</textarea>
                <p class="hidden peer-placeholder-shown:block pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300">If you fail to plan, you plan to fail</p>
            </div>
        </div>
    </div>
</x-layout>
