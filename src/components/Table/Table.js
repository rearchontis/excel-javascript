import { ExcelComponent } from "@core/ExcelComponent";
import { createTable } from "@/components/table/table.template";

export class Table extends ExcelComponent {
    static className = 'excel__table';
    /*
    статическое поле потому,
    что к нему можно получить доступ
    без создания инстанса класса
    */
    toHTML() {
        return createTable();
    }
}
