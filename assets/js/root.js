import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { mapStoreToProps, mapDispatchToProps, components } from '../store/storeToProps';
import store from '../store/store';
import "regenerator-runtime/runtime.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import i18n from "./utils/i18n";
import { withTranslation,I18nextProvider } from "react-i18next";

import { Navbar, Aside, SwapCard, Switch, ConnectionService, ConfirmSupply, WaitingConfirmation, IndicatorPanel, TopPairs } from './components/entry';
import BlankPage from './pages/blankPage';
import Etm from './pages/Etm';

import swapApi from './requests/swapApi';
import utils from './utils/swapUtils';
import img1 from '../img/logo.png';
import img2 from '../img/bry-logo.png';
import SwapAddon from './components/SwapAddon';
import LPTokensWalletInfo from './components/LPTokensWalletInfo';


class Root extends React.Component {
    constructor (props) {
        super(props);
        this.updLanguage();
        this.intervalUpdDexData();
        this.circleBalanceUpd();
    };

    convertPools (pools) {
        return pools.map(element => {
            return {
                token_0 : {
                    hash : element.asset_1,
                    volume : element.volume_1
                },
                token_1 : {
                    hash :  element.asset_2,
                    volume : element.volume_2
                },
                pool_fee : element.pool_fee,
                lt : element.token_hash
            };
        });
    };

    // --------------------------------------- upd dex data

    updDexData (pubkey) {
        this.updTokens();
        this.updPools();
        this.updBalances(pubkey);
    };

    intervalUpdDexData () {
        setInterval(() => {
            if (this.props.connectionStatus)
                this.updDexData(this.props.pubkey);
        }, 5000);
    };
    updBalances (pubkey) {
        if(pubkey != '')
            swapApi.getFullBalance(pubkey)
            .then(res => {
                if (!res.lock)
                    res.json()
                    .then(res => this.props.updBalances(res));
            });
    };
    updPools () {
        swapApi.getPairs()
        .then(res => {
            if (!res.lock)
                res.json()
                .then(res => this.props.updPairs(this.convertPools(res)));
        });
    };
    updTokens() {
        swapApi.getTokens()
        .then(res => {
            if (!res.lock)
                res.json()
                .then(tokens => {
                    this.addOptionalTokenInfo(tokens);
                });
        });
    };
    addOptionalTokenInfo (tokens) {
        let promises = [];
        for (let i in tokens) {
            if (this.props.tokens[i] && this.props.tokens[i].decimals !== undefined) {
                tokens[i].decimals = this.props.tokens[i].decimals;
                tokens[i].total_supply = this.props.tokens[i].total_supply;
                continue;
            }
            swapApi.getTokenInfo(tokens[i].hash)
            .then(res => {
                promises.push(res.json()
                    .then(info => {
                        if (!info.length)
                            return;
                        info = info[0];
                        tokens[i].decimals = info.decimals;
                        tokens[i].total_supply = info.total_supply;
                    })
                );                
            })
        }
        Promise.all(promises)
        .then(() => {
            this.props.assignAllTokens(tokens);
        });
    };

    // swapApi.getTokenInfo(pair.lt)
    //     .then(res => {
    //         if (!res.lock) {
    //             res.json()
    //             .then(total => {
    //                 if (Array.isArray(total) && total.length) {
    //                     this.total_supply = total[0].total_supply;
    //                 }
    //             })
    //         }
    //     })

    // ----------------------------------------------------

    circleBalanceUpd () {
        this.updBalanceForms();
        setInterval(() => {
            this.updBalanceForms();
        }, 2000);
    }

    updBalanceObj (menuItem, field) {
        this.props.assignBalanceObj(menuItem, field, utils.getBalanceObj(this.props.balances, this.props[menuItem][field].token.hash));
    };

    updBalanceForms () {
        if (this.props.menuItem == 'exchange') {
            this.updBalanceObj('exchange', 'field0');
            this.updBalanceObj('exchange', 'field1');
        } else if (this.props.menuItem == 'liquidity' && !this.props.liquidityMain && !this.props.liquidityRemove) {
            this.updBalanceObj('liquidity', 'field0');
            this.updBalanceObj('liquidity', 'field1');
        } else if (this.props.menuItem == 'liquidity' && this.props.liquidityRemove) {
            this.updBalanceObj('removeLiquidity', 'field0');
            this.updBalanceObj('removeLiquidity', 'field1');
            this.updBalanceObj('removeLiquidity', 'ltfield');
        }
    };

    updLanguage () {
        let locale = this.props.activeLocale;
        swapApi.getLanguage(locale)
        .then(res => {
            res.json()
            .then(langData => {
                this.props.changeLanguage(langData);
            });
        })
    };

    menuViewController () {
        switch (this.props.menuItem) {
            case 'exchange':
            case 'liquidity':
                return (
                    <div className="swap-card-wrapper">
                        <div className='swap-card position-relative'>
                            <div id='switch'>
                                <Suspense fallback={<div>---</div>}>
                                    <Switch />
                                </Suspense>    
                            </div>
                            <Suspense fallback={<div>---</div>}>
                                <SwapCard />
                            </Suspense>
                            <Suspense fallback={<div>---</div>}>
                                <ConfirmSupply />
                            </Suspense>
                            <Suspense fallback={<div>---</div>}>
                                <WaitingConfirmation />
                            </Suspense>    
                        </div>
                        <div className="addon-card-wrapper mt-4">
                            {/* <SwapAddon /> */}
                            <LPTokensWalletInfo useSuspense={false}/>
                        </div>
                    </div>    
                );
            case 'etm':
                return (
                    <> </>
                    // <div id="ETMPage" style={{paddingLeft : (this.state.navOpened ? '330px' : '70px')}}>
                    //     <Etm root={ this } />
                    // </div>
                );
            case 'topPairs':
                return (
                    <div className="regular-page p-2 p-md-5 px-lg-0">
                        <TopPairs  useSuspense={false}/>
                    </div>                    
                );    
            default:
                return (
                    <BlankPage text="Coming soon"/>
                );
        };
    };

    changeMenuItem (newItem) {
        this.props.changeMenuItem(newItem);
    };

    openConnectionList () {
        this.props.openConList();
    };

    closeConnectionList () {
        this.props.closeConList();
    };

    connectionList () {
        if (this.props.connecionListOpened)
            return (
                <div>
                    <div id='connection-services'>
                        <Suspense fallback={<div>---</div>}>
                            <ConnectionService updDexData = {this.updDexData.bind(this)} useSuspense={true}/>
                        </Suspense>
                    </div>
                </div>
            );
    };

    render () {       
        return (
            <div>
            <Suspense fallback={<div>---</div>}>
                <Navbar useSuspense={true}/>
                </Suspense>
                <main role='main' className={`container-fluid px-0 position-relative aside-${this.props.navOpened ? 'open' : 'closed'}`}>
                    <div id="contentWrapper" className='d-flex pb-5'>
                        <Suspense fallback={<div>---</div>}>
                            <Aside useSuspense={true} />
                        </Suspense>
                        {this.menuViewController()}
                        {this.connectionList()}
                    </div>
                    {/* <div id="toastWrapper" className="position-absolute pt-4">
                        <CommonToast />
                    </div> */}    

                </main>
                {this.props.connectionStatus && 
                    <div className="w-100 d-flex align-items-center justify-content-center d-xl-none" style={{height:'50px', background: 'white', position: 'fixed', bottom: '0px', backgroundColor: 'var(--menu-bg-non-transparent)', zIndex: '901'}}>
                        <IndicatorPanel />
                    </div>                    
                }
            </div>
        );
    };
};

const WRoot = connect(mapStoreToProps(components.ROOT), mapDispatchToProps(components.ROOT))(withTranslation()(Root));

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Provider store={ store } >
            <Suspense fallback={<div>---</div>}>
                <WRoot />
            </Suspense>
        </Provider>
    </I18nextProvider>,
    document.getElementById('root')
);