import { Header } from "./Header";

export interface RequestBody<T> {
  header?: Header;
  payload?: T | T[];
}
