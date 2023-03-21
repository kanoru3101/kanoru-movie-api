import { User } from "@models"
import {LANGUAGES} from "@constants";

export type GetUser = {
  params: void,
  query: void,
  response: Pick<User, 'id' | 'email' | 'name' | 'logo' | 'slug'>,
  body: void
}

export type ChangeLanguage = {
  params: void,
  query: void,
  response: { status: "OK"},
  body: { language: LANGUAGES}
}
