import {Component} from "vue";

export interface TabItem {
    title: string
    name: string
    icon?: Component
}

export type Tabs = Array<TabItem>
