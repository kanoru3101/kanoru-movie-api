import {SaveOrUpdateVideos} from "@services/video/types";
import {repositories} from "@services/typeorm";
import {In} from "typeorm";
import {Video} from "@models";

export const saveOrUpdateVideos = async ({ movies }: SaveOrUpdateVideos): Promise<Video[]> => {

    const videos = movies
        .map((movie) => movie?.videos?.results?.map((video) => video) || [])
        .flat()

    const videoDbIds = videos.map(video => video.id)

    const videosFromDB = await repositories.video.find({ where: { movie_db_id: In(videoDbIds) }, take: 100})

    const videosData = videos.map((video) => {
        const data = {
            movie_db_id: video.id,
            language: video.iso_639_1,
            name: video.name,
            site: video.site,
            type: video.type,
            key: video.key,
            size: video.size,
            official: video.official,
            published_at: video.published_at,
        }
        const foundVideo = videosFromDB.find(videoDB => videoDB.movie_db_id === video.id) || null;

        if (foundVideo) {
            return {...data, id: foundVideo.id}
        }

        return data
    });

    return await repositories.video.save(videosData)
}
