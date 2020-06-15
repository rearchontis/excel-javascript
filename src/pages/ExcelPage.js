import { Page } from "@core/Page";
import { createStore } from '@core/createStore';
import { rootReducer } from '@/redux/rootReducer';
import { storage, debounce } from '@core/utils';
import { Excel } from '@/components/Excel/Excel';
import { Header } from '@/components/Header/Header';
import { Toolbar } from '@/components/Toolbar/Toolbar';
import { Formula } from '@/components/Formula/Formula';
import { Table } from '@/components/Table/Table';
import { normalizeInitialState } from "../redux/initialState";

function storageName(param) {
    return 'excel:' + param;
}

export class ExcelPage extends Page {
    getRoot() {
        const params = this.params ? this.params : Date.now().toString();
        const initialState = normalizeInitialState(state);
        const store = createStore(rootReducer, initialState);
        const state = storage(storageName(params));
        const stateListener = debounce(state => {
            storage(storageName(params), state);
        }, 300);

        store.subscribe(stateListener);

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
    }
}
