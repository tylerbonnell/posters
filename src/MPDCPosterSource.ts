import axios from "axios"
import parse, { HTMLElement } from "node-html-parser"
import { PosterSource } from "./PosterSource"

/**
 * movieposters.com
 */
export class MPDCPosterSource implements PosterSource {

    private readonly url

    constructor(collectionURL: string) {
        this.url = collectionURL
    }

    getPosterUrls(): Promise<Map<string, string>> {
        return new Promise(resolve => {
            const result = new Map<string, string>()

            // just request a bunch of pages, since there probably aren't more than 30
            Promise.all(Array.from({ length: 30 }, (v, k) => this.getPage(k+1)))
                .then(pageResults => 
                    pageResults.forEach(page => 
                        page.forEach((v, k) => result.set(k, v))
                    )
                ).then(() => resolve(result))
        })
    }

    private getPage(page: number): Promise<Map<string, string>> {
        const url = `https://moviepostershopcom.ecomm-nav.com/nav.js?callback=lol&page=${page}&initial_url=https://www.movieposters.com/collections/size-27-x-39#?res_per_page=96`
        return axios.get(url)
            .then(response => {
                const items = parse(response.data).querySelectorAll('.collection-item__details')
                const result = new Map<string, string>()
                for (const item of items) {
                    const url = (item as HTMLElement).getAttribute("href")
                    const title = item.childNodes
                            .filter(node => node instanceof HTMLElement)
                            .map(node => node as HTMLElement)
                            .filter(node => node.rawTagName === "h3")[0]
                            .childNodes[0]
                            .rawText
                    result.set(title, url as string)
                }
                return result
            })
    }
}