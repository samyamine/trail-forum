import React from "react";

export default function TopicCategory({ text, color }: { text: string, color: string }) {
    return (
        <div className={`w-fit px-3 py-1 ${color} rounded-full text-xs text-white`}>
            {text}
        </div>
    );
}