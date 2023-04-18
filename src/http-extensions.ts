import * as http from 'http';
import {ReqUser} from "./middlewares/authMiddleware";
import {ReqLanguage, ReqMovieLanguage} from "./middlewares/languageMiddleware";

declare module 'http' {
    interface IncomingMessage {
        user?: ReqUser | null;
        language: ReqLanguage;
        movieLanguage: ReqMovieLanguage;
    }
}
