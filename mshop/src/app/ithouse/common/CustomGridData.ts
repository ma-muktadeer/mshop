export interface CustomGridData {
    content: any[];
    total: number;
    pageable?: Pageable;
}

export interface GridConfig {
    gridAction: GridAction;
    actionValue: GridFillter | Pageable | GridSort | '';
}
export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort?: any;
}
export enum GridAction {
    Pegeable = 'pegeable',
    Filter = 'filter',
    Sort = 'sort'
}

export interface GridFillter {
    columnId: any;
    searchTerm: any;
}

export interface GridSort {
    columnId: any;
    term: any;
}

export interface Item {
    [key: string]: any;
}

export interface FilterCriteria {
    id: string;
    value: string | boolean;
}
