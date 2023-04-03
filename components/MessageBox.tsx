import { Role } from "@/utils/types";

export default function MessageBox({
  role,
  content,
}: {
  role: Role;
  content: string;
}) {
  return (
    <>
      <div
        className={`hyphens-auto flex flex-col break-words ${
          role === "User" ? "pl-[4vw] text-right" : "pr-[4vw] text-left"
        }`}
        lang="en"
      >
        <div className="opacity-50">{role}</div>
        <div className="text-lg">{content}</div>
      </div>
      <div className="divider my-1"></div>
    </>
  );
}
