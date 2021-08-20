import initialState from '../initialState';
import actionPack from '../actions/actions';

const actions = actionPack.root;

function rootStore (state, changingProperty) {
    return {
        ...state,
        ...changingProperty
    };
}

export default function rootReducer (state = initialState.root, action) {
    switch (action.type) {
        case actions.TOGGLE_ASIDE: 
            return rootStore(state, {
                navOpened : !state.navOpened
            });

        case actions.CHANGE_NET:
            return rootStore(state, { net : action.value });

        case actions.ASSIGN_MAIN_TOKEN:
            return rootStore(state, { mainToken : action.value });            

        case actions.CHANGE_LANG:
            return rootStore(state, { langData : action.value });

        case actions.OPEN_CONNECTION_LIST:
            return rootStore(state, { connecionListOpened : true });

        case actions.CLOSE_CONNECTION_LIST:
            return rootStore(state, { connecionListOpened : false });

        case actions.CHANGE_CONN_STATUS:
            return rootStore(state, { connectionStatus : action.value });

        case actions.CHANGE_MENU_ITEM:
            return rootStore(state, { menuItem : action.value });

        case actions.ASSIGN_PUBKEY:
            return rootStore(state, { pubkey : action.value });

        case actions.UPD_ACTIVE_LOCALE:
            return rootStore(state, { activeLocale : action.value });

        case actions.SHOW_PENDING_STATE:
            return rootStore(state, { pendingIndicator : true });

        case actions.HIDE_PENDING_STATE:
            return rootStore(state, { pendingIndicator : false });
        
        case actions.UPD_BALANCES:
            return rootStore (state, { balances : action.value });

        case actions.UPD_PAIRS:
            return rootStore(state, { pairs: action.value });

        case actions.ASSIGN_ALL_TOKENS:
            return rootStore(state, { tokens : action.value });

        case actions.UPD_CURRENT_TX_HASH:
            return rootStore(state, { currentTxHash : action.value });

        case actions.UPD_RECENT_TXS:
            return rootStore(state, { recentTxs: action.value })

        case actions.UPD_MAIN_TOKEN_DATA:
            return rootStore(state, { mainToken: action.hash , mainTokenFee : action.fee })

        default:
            return state;
    }
};