import ApiError from "errors"
import { SignIn } from "./types"

export const signIn = async ({ password, email }: SignIn): Promise<string> => {
  if (!password || !email) {
    throw new ApiError('Missing password or email')
  }

  return "";
}
