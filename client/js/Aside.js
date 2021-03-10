class Aside extends React.Component {
    constructor (props) {
        super(props);
        this.mySwapPage = props.outer;
        console.log(this.mySwapPage)
        this.itemsOrder = ['home', 'exchange', 'liquidity', 'ido', 'farms', 'pools', 'etm', 'info', 'docs'];
        this.menuItems = {
            home : {
                iconClasses: 'icon-Icon23',
                action: undefined
            },
            exchange : {
                iconClasses: 'icon-Icon10',
                action: undefined
            },
            liquidity : {
                iconClasses: 'icon-Icon18',
                action: undefined
            },
            ido : {
                iconClasses: 'icon-Icon21',
                action: undefined
            },
            farms : {
                iconClasses: 'icon-Icon20',
                action: undefined
            },
            pools : {
                iconClasses: 'icon-Icon22',
                action: undefined
            },
            etm : {
                iconClasses: 'icon-Icon25',
                action: undefined
            },
            info : {
                iconClasses: 'icon-Icon24',
                action: undefined
            },
            docs : {
                iconClasses: 'icon-Icon19',
                action: undefined
            }
        }
    };

    render () {
        return (
            <div id='aside' className='aside-left position-fixed d-flex flex-column justify-content-between pt-4 pb-3 px-3'>
                <div class='aside-menu'>
                    {this.itemsOrder.map((item, index) => (
                        <div className='menu-item d-flex align-items-center justify-content-start mb-2'>
                            <span className={this.menuItems[item].iconClasses + ' icon-wrapper'}/>
                            <span>{this.mySwapPage.state.langData.navbars.left[item]}</span>
                        </div>
                    ))}
                </div>
                <div className='d-flex flex-column justify-content-between'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <div className='exchange-rate'>

                        </div>
                        <div className='lang-switcher d-flex align-items-center justify-content-between menu-item '>
                            <span className='icon-Icon6'/>                            
                            {this.mySwapPage.siteLocales.map((item, index) => (
                                <div value={index} onClick={this.mySwapPage.changeLanguage.bind(this.mySwapPage, item)}>{item.toUpperCase()}</div>
                            ))}
                        </div>
                    </div>
                    <Socials/>
                </div>                
            </div>
        );
    };
};
