import { User } from "@models"

export type GetUser = {
  userId?: number
}

export type GetUserResponse = Pick<User, 'id' | 'email' | 'name' | 'slug' | 'logo'>