import axios from "axios"
import parse, { HTMLElement } from "node-html-parser"
import { PosterListing } from "./PosterListing"
import { PosterSource } from "./PosterSource"

/**
 * movieposters.com
 */
export class MPDCPosterSource implements PosterSource {

    private readonly url: string
    private readonly pageLimit: number

    constructor(collectionURL: string, pageLimit: number) {
        this.url = collectionURL
        this.pageLimit = pageLimit
    }

    getPosterUrls(): Promise<Map<string, PosterListing>> {
        return new Promise(resolve => {
            const result = new Map<string, PosterListing>()

            // just request a bunch of pages
            Promise.all(Array.from({ length: this.pageLimit }, (v, k) => this.getPage(k+1)))
                .then(pageResults => 
                    pageResults.forEach(page => 
                        page.forEach((url, title) => 
                            result.set(title, { title, url })
                        )
                    )
                ).then(() => resolve(result))
        })
    }

    /**
     * @returns a promise for a map of title => url
     */
    private getPage(page: number): Promise<Map<string, string>> {
        const url = `https://moviepostershopcom.ecomm-nav.com/nav.js?callback=lol&page=${page}&initial_url=${this.url}#?res_per_page=96`
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
            .catch(e => {
                console.log(`failed to fetch ${url}`)
                return new Map()
            })
    }
}