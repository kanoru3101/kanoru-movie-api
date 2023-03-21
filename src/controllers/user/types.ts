import { User } from "@models"
import {LANGUAGES} from "@constants";

export type GetUser = {
  userId?: number
}

export type GetUserResponse = Pick<User, 'id' | 'email' | 'name' | 'slug' | 'logo' | 'language'>

export type UpdateUserLanguage = {
  userId?: number
  language: LANGUAGES
}
