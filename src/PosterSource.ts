import { PosterListing } from "./PosterListing"

export interface PosterSource {
    getPosterUrls(): Promise<Map<string, PosterListing>>
}
