import { Page } from "@core/page/Page";
import { createStore } from '@core/store/createStore';
import { rootReducer } from '@/redux/rootReducer';
import { Excel } from '@/components/Excel/Excel';
import { Header } from '@/components/Header/Header';
import { Toolbar } from '@/components/Toolbar/Toolbar';
import { Formula } from '@/components/Formula/Formula';
import { Table } from '@/components/Table/Table';
import { normalizeInitialState } from "@/redux/initialState";
import { StateProcessor } from "@core/page/StateProcessor";
import { LocalStorageClient } from "@/shared/LocalStorageClient";

export class ExcelPage extends Page {
    constructor(param) {
        super(param);

        this.storeSub = null;
        this.processor = new StateProcessor(
            new LocalStorageClient(this.params)
        );
    }

    async getRoot() {
        const state = await this.processor.get();
        const initialState = normalizeInitialState(state);
        const store = createStore(rootReducer, initialState);

        this.storeSub = store.subscribe(this.processor.listen);

        this.excel = new Excel({
            components: [
                Header,
                Toolbar,
                Formula,
                Table,
            ],
            store,
        });

        return this.excel.getRoot();
    }

    afterRender() {
        this.excel.init();
    }

    destroy() {
        this.excel.destroy();
        this.storeSub.unsubscribe();
    }
}
