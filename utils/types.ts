// role is a string that can only be "GPT" or "USR"
export type Role = "user" | "assistant" | "system";

export type Message = {
  role: Role;
  content: string;
};
