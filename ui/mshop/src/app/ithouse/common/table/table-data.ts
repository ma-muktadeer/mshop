import { GridState } from "angular-slickgrid";

export interface TableData {
    content: any[];
    total: number;
    pageSize?: number;
    order?: any;
    totalPages?: number;
}


export interface TableFilter {
    columnId: any;
    searchTerm: any;
}

export interface Item {
    [key: string]: any;
}

export interface TableFilterCriteria {
    id: string;
    value: string | boolean;
}

export interface TablePresets {
    gridId: string,
    presets: GridState,
}