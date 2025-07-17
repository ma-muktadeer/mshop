export interface CustomGridData {
    content: any[];
    total: number;
    pageSize?: number;
    order?: any;
    totalPages?: number;
}

export interface FilterCriteria {
  id: string;
  value: string | boolean;
}
