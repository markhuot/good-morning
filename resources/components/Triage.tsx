import React, { useEffect, useState } from "react";
import { Checkbox } from "./Checkbox";
import { php } from "@markhuot/synapse/php";

const handleTriage = php`
    use \App\Models\Todo;

    $answers = collect(request()->validate([
        'answer.*' => 'required|in:today,complete,ignore,delete',
    ])['answer']);

    $answers->map(fn ($answer, $id) => ['id' => $id, 'answer' => $answer])
        ->groupBy(fn ($answer) => $answer['answer'])
        ->map->pluck('id')
        ->each(function ($ids, $group) {
            if ($group === 'today') {
                Todo::whereIn('id', $ids)->update(['day' => now()->format('Y-m-d')]);
            }
            if ($group === 'complete') {
                Todo::whereIn('id', $ids)->update(['completed' => true]);
            }
            if ($group === 'ignore') {
                Todo::whereIn('id', $ids)->update(['ignored_when_late' => true]);
            }
            if ($group === 'delete') {
                Todo::whereIn('id', $ids)->delete();
            }
        });
`.execute;

export function Triage({ todos }) {
    if (! todos || todos.length === 0) {
        return null;
    }

    return (
        <form action={handleTriage} className="m-4 p-6 mt-6 space-y-6 bg-blue-50 border border-blue-100 rounded">
            <div className="space-y-2">
                <p className="text-lg font-bold text-black/80">Nice try!</p>
                <p className="text-black/80">
                    It looks like you didn&rsquo;t get a chance to wrap everything up
                    yesterday.
                </p>
                {/*
                <p>The last few times you didn't get to everything it was because:</p>
                <ul className="list-disc pl-6 text-sm">
                    <li>I was busy working on things.</li>
                </ul>
                <p>Mind sharing what happened this time?</p>
                <div>
                    <textarea className="border border-2 border-blue-200 bg-blue-100 rounded p-2 w-full focus:border-blue-600 focus:outline-none" placeholder="I couldn't finish these because..."></textarea>
                    <p className="text-xs text-slate-400">
                        Anything you share is private to you and used only for your own reflection.
                    </p>
                </div>
                */}
                <p>How do you want to handle yesterday&rsquo;s tasks?</p>
            </div>
            <ul className="mt-1 space-y-2">
                {todos.map((todo) => (
                    <li key={todo.id} className="group rounded bg-blue-100 overflow-hidden">
                        <div className="p-2">
                            <Checkbox {...todo} checkedClassName="group-has-[[value=complete]:checked]:inline-block"/>
                            <span className="
                                group-has-[[value=complete]:checked]:text-slate-400/80
                                group-has-[[value=ignore]:checked]:text-slate-400/80
                                group-has-[[value=delete]:checked]:text-red-400
                                group-has-[[value=delete]:checked]:line-through
                            " dangerouslySetInnerHTML={{__html: todo.title}}></span>
                        </div>
                        <p className="flex justify-between bg-blue-200/50 text-sm p-1">
                            <label className="py-0.5 px-2 rounded text-black/50 has-[:checked]:text-black/80 has-[:checked]:shadow-md has-[:checked]:bg-white has-[:focus-visible]:outline has-[:focus-visible]:outline-blue-500"><input className="absolute opacity-0" defaultChecked type="radio" name={`answer[${todo.id}]`} value="today"/>Do it today</label>
                            <label className="py-0.5 px-2 rounded text-black/50 has-[:checked]:text-black/80 has-[:checked]:shadow-md has-[:checked]:bg-white has-[:focus-visible]:outline has-[:focus-visible]:outline-blue-500"><input className="absolute opacity-0" type="radio" name={`answer[${todo.id}]`} value="complete"/>Complete it</label>
                            <label className="py-0.5 px-2 rounded text-black/50 has-[:checked]:text-black/80 has-[:checked]:shadow-md has-[:checked]:bg-white has-[:focus-visible]:outline has-[:focus-visible]:outline-blue-500"><input className="absolute opacity-0" type="radio" name={`answer[${todo.id}]`} value="ignore"/>Ignore it</label>
                            <label className="py-0.5 px-2 rounded text-black/50 has-[:checked]:text-black/80 has-[:checked]:shadow-md has-[:checked]:bg-white has-[:focus-visible]:outline has-[:focus-visible]:outline-blue-500"><input className="absolute opacity-0" type="radio" name={`answer[${todo.id}]`} value="delete"/>Delete it</label>
                        </p>
                    </li>
                ))}
            </ul>
            <button className="bg-blue-400/20 rounded px-6 py-2 font-bold text-black-80 hover:bg-blue-400 focus:bg-blue-400 transition transition-all">Save</button>
        </form>
    );
}
