import { Component } from '@angular/core';

@Component({
    selector: 'app-multi-tab-warning',
    templateUrl: './multi-tab-warning.html',
    styleUrls: ['./multi-tab-warning.scss']
})
export class MultiTabWarning {

    refreshPage() {
        window.location.reload();
    }
}
