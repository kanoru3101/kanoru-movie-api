import ApiError from "errors"
import {GetUser, GetUserResponse, UpdateUserLanguage} from "./types"
import {repositories} from "@services/typeorm"

export const getUser = async ({userId}: GetUser): Promise<GetUserResponse> => {
    if (!userId) {
        throw new ApiError("User didn't find")
    }


    const user = await repositories.user.findOne({where: {id: userId}})

    if (!user) {
        throw new ApiError("User didn't find")
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        slug: user.slug,
        language: user.language,
        logo: user.logo,
    };
}

export const updateUserLanguage = async ({userId, language}: UpdateUserLanguage): Promise<void> => {
    if (!userId) {
        throw new ApiError("User didn't find")
    }

    await repositories.user.update({id: userId}, {language})
}
