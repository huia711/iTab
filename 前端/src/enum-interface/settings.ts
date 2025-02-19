export interface ImgStyle {
    backgroundColor: string;
    borderColor: string;
    outlineColor: string;
    cursor: string;
    width: string;
    height: string;
}

export interface PageColorStyle {
    fontColor: string;
    customBackgroundColor: boolean;
    customButtonColor: boolean;
    presetColor: number;
    backgroundColor: {
        hex: string;
        alpha: number;
    };
    buttonColor: {
        hex: string;
        alpha: number;
    };
}

// 之前
export enum ThemeMode {
    Auto,
    Light,
    Dark
}

export enum BackgroundType {
    None,
    Local,
    Bing
}

export interface BackgroundSetting {
    id?: string
    type?: BackgroundType
    url?: string
    blur?: number
    maskColor?: string
    maskOpacity?: number
    autoOpacity?: boolean
}

export interface BookMarkIcon {
    size: number
}

export interface BookMarkSetting {
    enable: boolean,
    row: number
    col: number
    gap: number
    iconSize: number
    boardSize: number
    boardColor: string
    boardOpacity: number
    boardRadius: number
}

export enum AlignType {
    searchCenter,
    overallCenter
}

export interface LayoutSetting {
    align: AlignType
}

export interface PopupSettting {
    current: number
}

export type Option<T> = {
    [K in keyof T]?: T[K]
}

