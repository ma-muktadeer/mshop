// import { BackendService, BackendServiceOption, FilterChangedArgs, MultiColumnSort, PaginationChangedArgs, PaginationCursorChangedArgs, SingleColumnSort } from "@slickgrid-universal/common";
import { GridAction, GridConfig, GridFillter, GridSort, Pageable } from "../../ithouse/common/CustomGridData";

import { BackendService, BackendServiceOption, FilterChangedArgs, MultiColumnSort, PaginationChangedArgs, PaginationCursorChangedArgs, SingleColumnSort } from 'angular-slickgrid';

export class IthouseBackendService implements BackendService {

    buildQuery(serviceOptions?: BackendServiceOption): string {
        debugger
        //     const pageable: Pageable={
        //         pageNumber: serviceOptions?.paginationOptions?.pageNumber || 1,
        //         pageSize: serviceOptions?.paginationOptions?.pageSize || 5,
        //     }
        return this.buildQuary(GridAction.Pegeable, '');
    };
    resetPaginationOptions() { console.log('rreset pagination options...') };
    updateOptions: (serviceOptions?: Partial<BackendServiceOption>) => void;
    processOnFilterChanged = (event: Event | KeyboardEvent | undefined, args: FilterChangedArgs): string => {
        debugger
        const gridFillter: GridFillter = {
            columnId: args.columnDef.field,
            searchTerm: args?.searchTerms ? args?.searchTerms[0] : '',
        }

        return this.buildQuary(GridAction.Filter, gridFillter);
    };
    processOnPaginationChanged(event: Event | undefined, args: PaginationChangedArgs | (PaginationCursorChangedArgs & PaginationChangedArgs)): string {
        debugger
        const pageable: Pageable = {
            pageNumber: args?.newPage || 1,
            pageSize: args?.pageSize || 5,
        }

        return this.buildQuary(GridAction.Pegeable, pageable);
    };
    processOnSortChanged = (event: Event | undefined, args: SingleColumnSort | MultiColumnSort | any): string => {
        debugger
        const gridFillter: GridFillter = {
            columnId: args.sortCols[0].columnId,
            searchTerm: args.sortCols[0].sortAsc,
        }

        return this.buildQuary(GridAction.Sort, gridFillter);
    };

    buildQuary = (gridAction: GridAction, actionValue: Pageable | GridFillter | GridSort | ''): string => {
        const gridConfig: GridConfig = {
            gridAction: gridAction,
            actionValue: actionValue,
        }
        return JSON.stringify(gridConfig);
    }


}
