import {fetchWrapper} from "@/app/lib/fetchWrapper";

export const getSearchResults = async (searchText: string) => {
    return await fetchWrapper.get('/search', {searchText: searchText})
}