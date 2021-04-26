import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { mapStoreToProps, mapDispatchToProps, components } from '../../store/storeToProps';

import extRequests from '../requests/extRequests';
import swapApi from '../requests/swapApi';
import utils from '../utils/swapUtils';

class IndicatorPanel extends React.Component {
    constructor (props) {
        super(props);
        this.networks = {
            bit : {
                id : 'bit',
                name : 'BIT',
                url : 'http://bit-dev.enecuum.com/',
                action : undefined
            },
            pdex : {
                id : 'pdex',
                name : 'πDEX',
                url :  location.href,
                action : undefined
            }
        };
        this.netsOrder = ['bit', 'pdex'];
        this.updData();
    };

    renderPendingIndicator () {
        if (this.props.pendingIndicator)
            return(
                <div id="pendingIndicator" className="d-flex align-items-center justify-content-end px-3 mr-3">
                    <span className="mr-2">Pending</span>
                    <span className="spinner icon-Icon3"></span>
                </div>
            );
        else
            return(
                <></>
            );
    };

    changeNet (net) {
        swapApi.updUrl(net.url);
        this.props.changeNetwork(net.name, net.url, net.id);
    };

    renderWalletInfo() {
        return (
            <div className='wallet-info-wrapper d-flex align-items-center justify-content-end'>
                {this.renderPendingIndicator()}
                <div className='net wallet-info-boxes d-flex align-items-center justify-content-center mr-3'>
                    <Dropdown alignRight >
                        <Dropdown.Toggle variant="link" id="dropdown-basic" className="choose-net">
                            <span /*className='text-uppercase'*/>{this.networks[this.props.net.id].name}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="wrapper-1">
                            {this.netsOrder.map((item, index) => (
                                <Dropdown.Item className="text-center py-2 net-item" key={index} value={index} onClick={this.changeNet.bind(this, this.networks[item])}>{this.networks[item].name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className='enx-amount wallet-info-boxes d-flex align-items-center justify-content-center px-3 border-0 mr-0 mr-sm-3'>
                    {this.props.enx} ENX
                </div>
                <div className='wallet-info-boxes d-none d-sm-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center justify-content-center px-3'>{this.props.coinAmount} {this.props.coinName}</div>
                    <div className='addr wallet-info-boxes d-none d-md-flex align-items-center justify-content-center'>{this.packAdressString(this.props.pubkey)}</div>
                </div>
            </div>
        );
    };

    updData() {
        setInterval(() => {
            this.props.updCoinAmount(utils.getBalance(this.props.balances, this.props.nativeToken).amount);
        }, 5000);
    };

    packAdressString(addr) {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    render () {
        return this.renderWalletInfo();
    };
};

const WIndicatorPanel = connect(mapStoreToProps(components.INDICATOR_PANEL), mapDispatchToProps(components.INDICATOR_PANEL))(IndicatorPanel);

export default WIndicatorPanel;