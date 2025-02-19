export interface BookMarkItem {
    title: string
    url: string
    icon?: string
    textIcon: boolean
    custom: boolean
    page: number
}

export type BookMarks = Array<BookMarkItem>

export enum DragType {
    start,
    enter,
    over,
    end
}

export type SortData = {
    from: number
    to: number
}