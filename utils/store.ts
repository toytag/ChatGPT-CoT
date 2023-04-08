import { create } from 'zustand'

interface StreamState {
  // state
  // stream: ReadableStream | null;
  content: string;
  // actions
  // setStream: (stream: ReadableStream | null) => void;
  setContent: (content: string) => void;
  appendContent: (content: string) => void;
  // setContent: (fn: (prev: string) => string) => void;
}

export const useStreamStore = create<StreamState>(set => ({
  // state
  // stream: null,
  content: "",
  // actions
  // setStream: (stream) => set({ stream }),
  setContent: (content) => set({ content }),
  appendContent: (content) => set((state) => ({ content: state.content + content })),
  // setContent: (fn: (prev: string) => string) => {
  //   set((state) => ({ content: fn(state.content) }));
  // },
}));
