import Layout from 'layout.tsx';

export default function Index({ date, todos }) {
    return (
        <Layout>
            <h1>{date.format('F j')}</h1>
            <ul>
                {todos.map(todo => (
                    <li>
                        <input type="checkbox" onChange={() => {
                            todo.completed = !todo.completed;
                            todo.save();
                        }}/>
                        {todo.title}
                    </li>
                ))}
                <li>
                    <form action={async () => {
                        todos.push({ title: event.target.title.value });
                        await laravel.post('todo.store');
                    }}>
                        <input type="hidden" name="date" value={date.format('Y-m-d')}/>
                        <div>
                            <input type="text" name="title"/>
                            {errors.title && (
                                <div className="text-red-500">{errors.title.message}</div>
                            )}
                        </div>
                        <button>Add</button>
                    </form>
                </li>
            </ul>
        </Layout>

    );
}
