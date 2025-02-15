import React from "react";
import {Actions} from "./Actions";

export function Todo({ todo })  {
    return (
        <div className="inline">
            <Actions todo={todo}/>
            {todo.title} ({todo.id})
        </div>
    );
}
