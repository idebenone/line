import { atom } from "jotai";
import { Repository, User } from "./types";

export const userAtom = atom<User>();
export const repositoriesAtom = atom<Repository[]>([]);
export const topRepositoriesAtom = atom<Repository[]>([]);
export const themeAtom = atom<string>("light");