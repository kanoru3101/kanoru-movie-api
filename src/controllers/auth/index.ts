import ApiError, { HTTP_STATUS_CODE } from "errors"
import { SignIn, SignUp } from "./types"
import { repostories } from "@services/typeorm"
import * as authService from "@services/auth"
import { generateSlug } from "@utils/slugGererator"
import { User } from "@models"

export const signIn = async ({ password, email }: SignIn): Promise<string> => {
  if (!password || !email) {
    throw new ApiError('Missing password or email')
  }

  const passwordHash = authService.createPasswordHash({ password })

  const user = await repostories.user.findOne({
    where: { email }
  })
  
  if (!user || passwordHash !== user?.password) {
    throw new ApiError('Wrong email or password', HTTP_STATUS_CODE.NOT_FOUND)
  }

  const token = authService.generateJWT({ id: user.id, email: user.email })

  return token;
}

export const signUp = async ({ name, password, email}: SignUp): Promise<string> => {
  if (!password || !email) {
    throw new ApiError('Missing password || email')
  }

  const passwordHash = authService.createPasswordHash({ password })

  const foundUser = await repostories.user.findOne({
    where: { email }
  })

  if (foundUser) {
    throw new ApiError("User with this email already exist")
  }

  const slug = generateSlug({})

  const userName = name || 'User';

  const user = new User()
  user.email = email;
  user.password = passwordHash;
  user.name = userName;
  user.slug = slug

  const data = await repostories.user.save(user)

  const token = authService.generateJWT({ id: data.id, email: user.email })

  return token;
}
