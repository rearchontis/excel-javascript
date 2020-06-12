import { ExcelComponent } from '@core/ExcelComponent';
import { TableSelection } from '@/components/table/TableSelection';
import { createTable } from '@/components/table/table.template';
import { resizeHandler } from "@/components/table/table.resize";
import { shouldResize } from '@/components/table/table.functions';
import { nextSelector } from '@/components/table/table.functions';
import { isCell } from '@/components/table/table.functions';
import { matrix } from '@/components/table/table.functions';
import { $ } from '@core/DOM';
export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown', 'keydown', 'input'],
            ...options,
        });
    }

    toHTML() {
        return createTable(20);
    }

    prepare() {
        this.selection = new TableSelection();
    }

    init() {
        super.init();

        const firstCellSelector = '[data-id="0:0"]';
        const cell = this.$root.find(firstCellSelector);

        this.selection.select(cell);
        this.$emit('table:select', cell);

        this.selectCell(cell);

        this.$on('formula:input', text => {
            this.selection.current.text(text);
        });
        this.$on('formula:done', () => {
            this.selection.current.focus();
        });
    }

    selectCell($cell) {
        this.selection.select($cell);
        this.$emit('table:select', $cell);
    }

    onMousedown(event) {
        if (shouldResize(event)) {
            resizeHandler(this.$root, event);
        } else if (isCell(event)) {
            const $target = $(event.target);
            if (event.shiftKey) {
                const $cells = matrix($target, this.selection.current)
                    .map(id => {
                        return this.$root.find(`[data-id="${id}"]`);
                    });

                this.selection.selectGroup($cells);
            } else {
                this.selection.select($target);
            }
            this.$emit('table:select', $target);
        }
    }

    onKeydown(event) {
        const keys = [
            'Enter',
            'Tab',
            'ArrowUp',
            'ArrowRight',
            'ArrowDown',
            'ArrowLeft',
        ];
        const { key } = event;
        if (keys.includes(key) && !event.shiftKey) {
            event.preventDefault();
            const id = this.selection.current.id(true);
            const $next = this.$root.find(nextSelector(key, id));
            this.selectCell($next);
        }
    }
    onInput(event) {
        this.$emit('table:input', $(event.target));
    }
}


