import actionPack from '../actions/actions';

const actions = actionPack.swapCard;

const actionCreators = {
    swapFields (mode) {
        return {
            type : actions.SWAP_FIELDS,
            mode : mode
        };
    },

    assignBalanceObj (mode, field, balanceObj) {
        return {
            type : actions.ASSIGN_WALLET_VALUE,
            field : field,
            value : balanceObj,
            mode : mode
        };
    },

    assignCoinValue (mode, field, value) {
        return {
            type : actions.ASSIGN_COIN_VALUE,
            field : field,
            value : value,
            mode : mode
        };
    },

    assignTokenValue (mode, field, tokenObj) {
        return {
            type : actions.ASSIGN_TOKEN_VALUE,
            field : field,
            value : tokenObj,
            mode : mode
        };
    },

    openTokenList () {
        return {
            type : actions.OPEN_TOKEN_LIST
        };
    },

    closeTokenList () {
        return {
            type : actions.CLOSE_TOKEN_LIST
        };
    },

    changeLiquidityMode () {
        return {
            type : actions.CHANGE_LIQUIDITY_MODE
        };
    },

    openConfirmCard () {
        return {
            type : actions.OPEN_CONFIRM_CARD
        };
    },

    closeConfirmCard () {
        return {
            type : actions.CLOSE_CONFIRM_CARD
        };
    },

    updActiveField (value) {
        return {
            type : actions.UPD_ACTIVE_FIELD,
            value : value
        };
    },

    openWaitingConfirmation () {
        return {
            type : actions.OPEN_WAITING_CONFIRMATION
        };
    },

    closeWaitingConfirmation () {
        return {
            type : actions.CLOSE_WAITING_CONFIRMATION
        };
    },

    changeWaitingStateType (stateType) {
        return {
            type : actions.CHANGE_WAITING_STATE_TYPE,
            value : stateType
        };
    },
    
    toggleRemoveLiquidityView () {
        return {
            type : actions.TOGGLE_REMOVE_LIQUIDITY_VIEW
        };
    },

    changeCreatePoolState (booleanVar) {
        return {
            type : actions.CHANGE_CREATE_POOL_STATE,
            value : booleanVar
        }
    },
    
    updltList (list) {
        return {
            type : actions.UPD_LT_LIST,
            value : list
        };
    },

    changeRemoveLiquidityVisibility () {
        return {
            type : actions.CHANGE_REMOVE_LIQUDITY_VISIBILITY
        };
    }
};

export default actionCreators;