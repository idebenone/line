import { atom } from "jotai";

export const userAtom = atom<any>(null);
export const repositoriesAtom = atom<any[]>([]);
export const topRepositoriesAtom = atom<any[]>([]);
export const themeAtom = atom<string>("light");