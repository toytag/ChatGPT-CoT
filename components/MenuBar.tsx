"use client";

import React from "react";

export default function MenuBar() {
  return (
    <header className="sticky inset-x-0 top-4 z-50 mx-4 mb-2 mt-4 flex place-content-center">
      <div className="navbar rounded-box max-w-4xl bg-base-100/75 shadow-xl backdrop-blur">
        <div className="navbar-start">
          <a className="ml-3 text-xl font-bold">Chat</a>
          <span className="badge ml-2 place-self-center justify-self-start">
            GPT-4
          </span>
        </div>
        <div className="navbar-end">
          <SimpleClearHistoryBtn />
        </div>
      </div>
    </header>
  );
}

function SimpleClearHistoryBtn() {
  const [active, setActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    const listener = (e: PointerEvent | TouchEvent) => {
      if (
        document.getElementById("clear-history-btn")?.contains(e.target as Node)
      )
        return;
      setActive(false);
    };
    document.addEventListener("pointerdown", listener);
    document.addEventListener("touchstart", listener);
  }, []);

  return (
    <div
      className={`tooltip tooltip-left tooltip-error ${
        active ? "tooltip-open" : ""
      }`}
      data-tip="Clear Conversation"
    >
      <button
        id="clear-history-btn"
        onClick={async () => {
          if (active) {
            // second click reloads page
            await fetch("api/chat/history", { method: "DELETE" });
            window.location.reload();
          } else {
            // first click focuses button
            setActive(true);
          }
        }}
        // NOTE: Safari doesn't out-of-the-box support pure CSS focus
        className={`btn-circle btn ${active ? "btn-error" : "btn-ghost"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}
