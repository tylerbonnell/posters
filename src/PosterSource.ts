export interface PosterSource {
    getPosterUrls(): Promise<Map<string, string>>
}
