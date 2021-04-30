const actionPack =  {
    root : {
        TOGGLE_ASIDE            : 'TOGGLE_ASIDE',
        UPD_BALANCES            : 'UPD_BALANCES',
        CHANGE_NET              : 'CHANGE_NET',
        CHANGE_LANG             : 'CHANGE_LANG',
        OPEN_CONNECTION_LIST    : 'OPEN_CONNECTION_LIST',
        CLOSE_CONNECTION_LIST   : 'CLOSE_CONNECTION_LIST',
        CHANGE_CONN_STATUS      : 'CHANGE_CONN_STATUS',
        CHANGE_MENU_ITEM        : 'CHANGE_MENU_ITEM',
        ASSIGN_PUBKEY           : 'ASSIGN_PUBKEY',
        UPD_ACTIVE_LOCALE       : 'UPD_ACTIVE_LOCALE',
        SHOW_PENDING_STATE      : 'SHOW_PENDING_STATE',
        HIDE_PENDING_STATE      : 'HIDE_PENDING_STATE',
        UPD_PAIRS               : 'UPD_PAIRS',
        ASSIGN_ALL_TOKENS       : 'ASSIGN_ALL_TOKENS'
    },
    swapCard : {
        SWAP_FIELDS                         : 'SWAP_FIELDS',
        ASSIGN_WALLET_VALUE                 : 'ASSIGN_WALLET_VALUE',
        OPEN_TOKEN_LIST                     : 'OPEN_TOKEN_LIST',
        CLOSE_TOKEN_LIST                    : 'CLOSE_TOKEN_LIST',
        CHANGE_LIQUIDITY_MODE               : 'CHANGE_LIQUIDITY_MODE',
        OPEN_CONFIRM_CARD                   : 'OPEN_CONFIRM_CARD',
        CLOSE_CONFIRM_CARD                  : 'CLOSE_CONFIRM_CARD',
        ASSIGN_COIN_VALUE                   : 'ASSIGN_COIN_VALUE',
        ASSIGN_TOKEN_VALUE                  : 'ASSIGN_TOKEN_VALUE',
        UPD_ACTIVE_FIELD                    : 'UPD_ACTIVE_FIELD',
        OPEN_WAITING_CONFIRMATION           : 'OPEN_WAITING_CONFIRMATION',
        CLOSE_WAITING_CONFIRMATION          : 'CLOSE_WAITING_CONFIRMATION',
        CHANGE_WAITING_STATE_TYPE           : 'CHANGE_WAITING_STATE_TYPE',
        TOGGLE_REMOVE_LIQUIDITY_VIEW        : 'TOGGLE_REMOVE_LIQUIDITY_VIEW',
        CHANGE_CREATE_POOL_STATE            : 'CHANGE_CREATE_POOL_STATE',
        UPD_LT_LIST                         : 'UPD_LT_LIST',
        CHANGE_REMOVE_LIQUDITY_VISIBILITY   : 'CHANGE_REMOVE_LIQUDITY_VISIBILITY'
    },
    tokenCard : {
        ASSIGN_TOKEN_LIST : 'ASSIGN_TOKEN_LIST',
        CHANGE_SORT_MODE  : 'CHANGE_SORT_MODE'
    },
    aside : {
        UPD_EXCH_RATE : 'UPD_EXCH_RATE'
    },
    indicatorPanel : {
        UPD_COIN_AMOUNT : 'UPD_COIN_AMOUNT'
    }
};

export default actionPack;