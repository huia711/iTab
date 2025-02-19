export interface SearchEngineItem {
  id: string
  name: string
  baseUrl: string
  icon: string
  icon_select: string
  // description: string
}

// 以字符串类型为键，以 SearchEngineItem 类型为值的对象
export type SearchEngineData = Record<string, SearchEngineItem>

//  SearchEngineItem 元素的数组
export type SearchEngines = Array<SearchEngineItem>

export enum OpenPageTarget {
  Blank = "_blank",
  Self = "_self"
}

export enum SearchSuggestion {
  none =  '不使用',
  baidu = '百度 API',
  bing = 'Bing API',
  google = 'Google API'
}

export interface SearchSetting {
  // overwriteSearch: boolean
  currentEngine: string
  openPageTarget: OpenPageTarget
  showEngineIcon: boolean
  showEngineSelect: boolean
  searchInputRadius: number
  useSearchEngines: Array<string>
  suggestion: SearchSuggestion
}

export interface HistoryItem {
  engineId: string
  searchText: string
  timestamp: number
}

export interface SearchData {
  engine: string
  text: string
  target: OpenPageTarget
}

export interface SearchResultItem {
  title?: string
  urlText?: string
  url?: string
  description?: string
  icon?: string
  cover?: string
}

export type SearchResultData = Array<SearchResultItem>
