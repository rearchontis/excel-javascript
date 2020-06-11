import { ExcelComponent } from '@core/ExcelComponent';
import { createTable } from '@/components/table/table.template';
import { resizeHandler } from "@/components/table/table.resize";
import { shouldResize } from '@/components/table/table.functions';

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root) {
        super($root, {
            listeners: ['mousedown'],
        });
    }

    toHTML() {
        return createTable(20);
    }

  onMousedown(event) {
        if (shouldResize(event)) {
            resizeHandler(this.$root, event);
        }
    }
}

// 589 msScripting
// 2433 msRendering

// 440 msScripting
// 1771 msRendering

// 125 msScripting
// 329 msRendering
