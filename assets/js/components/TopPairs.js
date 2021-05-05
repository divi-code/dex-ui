import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { mapStoreToProps, mapDispatchToProps, components } from '../../store/storeToProps';
import { withTranslation } from "react-i18next";
import ValueProcessor from '../utils/ValueProcessor';
import swapUtils from '../utils/swapUtils';
import testFormulas from '../utils/testFormulas';
import '../../css/top-pairs.css';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

const valueProcessor = new ValueProcessor();

class TopPairs extends React.Component {
    constructor(props) {
        super(props);
        this.pairsArr = '';        
    };

    populateTable() {
    	let balances = this.props.balances;
		let pairs = this.props.pairs;
		let tokens = this.props.tokens;
    	let result = [];
    	let uniquePairsTokensList = {};
    	if (pairs !== undefined && Array.isArray(pairs) && pairs.length > 0 && tokens !== undefined && Array.isArray(tokens) && tokens.length > 0) {
			pairs.forEach(function(pair, i, pairsArr) {
				['token_0','token_1','lt'].forEach(function(tokenAlias, i, tokenIndexArr) {
					let hash = undefined;
					if (tokenAlias === 'token_0' || tokenAlias === 'token_1')
						hash = pair[tokenAlias].hash
					else if (tokenAlias === 'lt')
						hash = pair[tokenAlias]

					if (!uniquePairsTokensList.hasOwnProperty(pair[tokenAlias].hash))
						uniquePairsTokensList[hash] = {
							ticker : '',
							inWhiteList : false,
							decimals : undefined
						}
				});
			});
	
			tokens.forEach(function(tokenInNetwork, i, tokensInNetworkArr) {
				if (uniquePairsTokensList.hasOwnProperty(tokenInNetwork.hash)) {
					uniquePairsTokensList[tokenInNetwork.hash].ticker = tokenInNetwork.ticker;
					uniquePairsTokensList[tokenInNetwork.hash].inWhiteList = true;
					uniquePairsTokensList[tokenInNetwork.hash].decimals = tokenInNetwork.decimals;
					uniquePairsTokensList[tokenInNetwork.hash].total_supply = tokenInNetwork.total_supply;
				}
			});

			pairs.forEach(function(pair, i, pairsArr) {
				if ((uniquePairsTokensList[pair.token_0.hash].inWhiteList === true) && (uniquePairsTokensList[pair.token_1.hash].inWhiteList === true) && (uniquePairsTokensList[pair.lt].inWhiteList === true)) {
					let ltInBalance = balances.find(tokenBalance => tokenBalance.token === pair.lt);
					let amountLT = 0;
					if (ltInBalance !== undefined)						
						amountLT = ltInBalance.amount;

					let ltDestructionResult = testFormulas.ltDestruction(pair, uniquePairsTokensList[pair.lt].total_supply, {amount_lt : amountLT}, 'ltfield');
					console.log('ltDestructionResult', ltDestructionResult)

					result.push({
						token_0 : {
							hash : pair.token_0.hash,
							ticker : uniquePairsTokensList[pair.token_0.hash].ticker,
							volume : pair.token_0.volume,
							decimals : uniquePairsTokensList[pair.token_0.hash].decimals
							
						},
						token_1 : {
							hash : pair.token_1.hash,
							ticker : uniquePairsTokensList[pair.token_1.hash].ticker,
							volume : pair.token_1.volume,
							decimals : uniquePairsTokensList[pair.token_1.hash].decimals
						},
						lt : {
							hash : pair.lt,
							ticker : uniquePairsTokensList[pair.lt].ticker,
							decimals : uniquePairsTokensList[pair.lt].decimals,
							total_supply : uniquePairsTokensList[pair.lt].total_supply
						},
						your_lp_tokens : ltDestructionResult,
						your_pool_share : swapUtils.countPoolShare(pair, {value0 : ltDestructionResult.amount_1, value1 : ltDestructionResult.amount_2}, null)
					})
				}
			})	
    	} else {
    		return result;
    	}
    	console.log(result)
    	return result;    	
    }

    getTmpErrorElement() {
    	return (
	    	<div>
	    		No data
	    	</div>
	    )	
    } 

    getPairsTable() {
    	const t = this.props.t;
    	return (    		
	    	<div className="pairs-table-wrapper">
		    	<SimpleBar style={{paddingBottom: '25px', paddingTop : '10px'}} autoHide={false}>	
					<Table hover variant="dark" style={{tableLayout : 'auto'}}>
					  	<thead>
					    	<tr>
								<th>{t('numberSign')}</th>
								<th>{t('name')}</th>
								<th>{t('topPairs.ltTotalSupply')}</th>
								<th>{t('topPairs.volumeInPair', {indexInPair : 1})}</th>
								<th>{t('topPairs.volumeInPair', {indexInPair : 2})}</th>
								<th>{t('topPairs.yourTokensInPair', {indexInPair : 1})}</th>
								<th>{t('topPairs.yourTokensInPair', {indexInPair : 2})}</th>
								<th>{t('topPairs.yourPoolShare')}</th>								
					    	</tr>
					  	</thead>
						<tbody>
					        {this.pairsArr.map(( pair, index ) => {
					          return (
					            <tr key={index}>
									<td>{index + 1}</td>
									<td className="text-nowrap">{pair.token_0.ticker}-{pair.token_1.ticker}</td>
									<td>{valueProcessor.usCommasBigIntDecimals(pair.lt.total_supply, pair.lt.decimals, pair.lt.decimals)} {pair.lt.ticker}</td>
									<td>{valueProcessor.usCommasBigIntDecimals(pair.token_0.volume, pair.token_0.decimals, pair.token_0.decimals)} {pair.token_0.ticker}</td>
									<td>{valueProcessor.usCommasBigIntDecimals(pair.token_1.volume, pair.token_1.decimals, pair.token_1.decimals)} {pair.token_1.ticker}</td>
									<td>{pair.your_lp_tokens.amount_1} {pair.token_0.ticker}</td>
									<td>{pair.your_lp_tokens.amount_2} {pair.token_1.ticker}</td>
									<td>{pair.your_pool_share}</td>
					            </tr>
					          );
					        })}
					  	</tbody>
					</Table>
				</SimpleBar>
			</div>				
    	)
    }

    render() {
		const t = this.props.t;
		this.pairsArr = this.populateTable();
    	return (
    		<div className="row">
    			<div className="col-12 col-lg-10 offset-lg-1 col-xl-10 offset-xl-1">    			
					<Card className="c-card-1" id="topPairsCard">
					  <Card.Body>
					    <Card.Title>
					    	<div className="h4 py-3">{t('topPairs.title')}</div>
					    </Card.Title>
					    <Card.Text as="div">
						    {this.pairsArr.length > 0 ? this.getPairsTable() : this.getTmpErrorElement()}						    
					    </Card.Text>
					  </Card.Body>
					</Card>    			
    			</div>
    		</div>
        )
    }        
};

const WTopPairs = connect(mapStoreToProps(components.TOP_PAIRS), mapDispatchToProps(components.TOP_PAIRS))(withTranslation()(TopPairs));

export default WTopPairs;    