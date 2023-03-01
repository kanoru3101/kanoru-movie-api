import ApiError, { HTTP_STATUS_CODE } from "errors"
import { SignIn, SignUp } from "./types"
import { repositories } from "@services/typeorm"
import * as authService from "@services/auth"
import { generateSlug } from "@utils/slugGererator"
import { User } from "@models"
import * as rickAndMortyService from "@services/rickAndMortyApi"
import { MAX_CHARACTERS } from "@services/rickAndMortyApi/getCharacter"
import {LANGUAGES} from "@constants";

export const signIn = async ({ password, email }: SignIn): Promise<string> => {
  if (!password || !email) {
    throw new ApiError('Missing password or email')
  }

  const passwordHash = authService.createPasswordHash({ password })

  const user = await repositories.user.findOne({
    where: { email }
  })

  if (!user || passwordHash !== user?.password) {
    throw new ApiError('Wrong email or password', HTTP_STATUS_CODE.NOT_FOUND)
  }

  const token = authService.generateJWT({ id: user.id, email: user.email })

  return token;
}

export const signUp = async ({ name, password, email, language = LANGUAGES.UA }: SignUp): Promise<string> => {
  if (!password || !email) {
    throw new ApiError('Missing password || email')
  }

  const passwordHash = authService.createPasswordHash({ password })

  const foundUser = await repositories.user.findOne({
    where: { email }
  })

  if (foundUser) {
    throw new ApiError("User with this email already exist")
  }

  const slug = generateSlug({})

  const hero = await rickAndMortyService.getCharacter({
    characterNumber: Math.random() * MAX_CHARACTERS | 0,
  })

  const userName = name || hero.name;

  const user = new User()
  user.email = email;
  user.password = passwordHash;
  user.name = userName;
  user.slug = slug;
  user.logo = hero.image;
  user.language = language

  const data = await repositories.user.save(user)

  const token = authService.generateJWT({ id: data.id, email: user.email })

  return token;
}
