import { User } from "@models"

export type GetUser = {
  params: void,
  query: void,
  response: Pick<User, 'id' | 'email' | 'name' | 'logo' | 'slug'>,
  body: void
}
