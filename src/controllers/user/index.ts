import ApiError from "errors"
import { GetUser, GetUserResponse } from "./types"
import { repositories } from "@services/typeorm"

export const getUser = async ({ userId }: GetUser): Promise<GetUserResponse> => {
  if (!userId) {
    throw new ApiError("User didn't find")
  }


  const user = await repositories.user.findOne({ where: { id: userId } })

  if (!user) {
    throw new ApiError("User didn't find")
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    slug: user.slug,
    logo: user.logo,
  };
}
