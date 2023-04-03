import ReloadButton from "./ReloadButton";

export default function MenuBar() {
  return (
    <header className="sticky inset-x-0 top-4 z-50 mx-4 mb-2 mt-4 flex place-content-center">
      <div className="navbar rounded-box max-w-4xl bg-base-100/75 shadow-xl backdrop-blur">
        <div className="navbar-start">
          <a className="ml-3 text-xl font-bold">Chat</a>
          <span className="badge-accent badge-outline badge ml-2 place-self-center justify-self-start">
            GPT-3.5
          </span>
        </div>
        <div className="navbar-end">
          <ReloadButton />
        </div>
      </div>
    </header>
  );
}
