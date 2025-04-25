import {
    IntegrationCalledForVault,
    ExternalAdapterPairAdded
  } from "../../generated/IntegrationManager/IntegrationManager";
import {  IntegrationsEventData } from "../../generated/schema";
import { ComptrollerLogic } from "../../generated/templates/ComptrollerLogic/ComptrollerLogic"
import { convertSelectorToType } from '../utils/integration_selectors';
import { getOrCreateAsset } from "../entities/asset";
import { arrayUnique } from "../utils/helper";
import { getFundTokenAllocationId, getIntegrationDataId } from "../utils/id_generator";
import { log } from "@graphprotocol/graph-ts";
import { BIG_DECIMAL_ZERO } from "../utils/constants";
import { getOrCreateFundTokenAllocation, getOrCreateFund  } from "../entities/fund";
import { getTransactionDetails } from "../entities/transaction";
import { getActivityCounter } from "../utils/Counter";

export function handleExternalAdapterPairAdded(event: ExternalAdapterPairAdded): void {
    const comptrollerContractInstance = ComptrollerLogic.bind(event.address);
    /*log.warning("handleExternalAdapterPairAdded called {}",[event.address.toHexString()]);

    let newEnt = new newEntity(generateId(event));
    newEnt.blocknumber  = event.block.number;
    newEnt.save();*/

}


export function handleIntegrationCalledForVault(event: IntegrationCalledForVault): void {
    const comptrollerContractInstance = ComptrollerLogic.bind(event.params.comptrollerProxy);
    
    let integrationDataId = getIntegrationDataId(comptrollerContractInstance.fundManager(),
                                                 comptrollerContractInstance.vaultProxy(), 
                                                 event.params.selector);
    let integrationsdata = IntegrationsEventData.load(integrationDataId);
    if (integrationsdata == null) {
        integrationsdata = new IntegrationsEventData(integrationDataId);
        integrationsdata.incomingAsset = [];
        integrationsdata.incomingAssetBalance = [];
        integrationsdata.outgoingAsset = [];
        integrationsdata.outgoingAssetBalance = [];
    }
    
    let integrationName = convertSelectorToType(event.params.selector.toHexString());
    integrationsdata.integrationEventName = integrationName;
    integrationsdata.selector = event.params.selector;
    integrationsdata.comptrollerProxy = event.params.comptrollerProxy;
    integrationsdata.timestamp = event.block.timestamp;
    integrationsdata.transaction = getTransactionDetails(event).id;
    integrationsdata.activityCounter = getActivityCounter();
    integrationsdata.activityCategories = ['Vault'];
    integrationsdata.activityType = 'Trade';  
    integrationsdata.vault = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString()).id;
    const incomingAssets = event.params.incomingAsset;
    
    const incomingAssetBalances  = event.params.incomingAssetBalance;
    const outgoingAssets = event.params.outgoingAsset;
    const outgoingAssetBalances  = event.params.outgoingAssetBalance;

    for (let i=0; i< outgoingAssets.length; i++) {
        if (i < incomingAssets.length) {
            integrationsdata.incomingAsset = arrayUnique<string>(integrationsdata.incomingAsset.concat([getOrCreateAsset(incomingAssets[i]).id]));
            integrationsdata.incomingAssetBalance = arrayUnique<string>(integrationsdata.incomingAssetBalance.concat([incomingAssetBalances[i].toHexString()]));
            let tokenId = getFundTokenAllocationId(comptrollerContractInstance.vaultProxy(), incomingAssets[i]);
            let fundTokenAllocationInfo = getOrCreateFundTokenAllocation(tokenId, comptrollerContractInstance.vaultProxy(), incomingAssets[i]);
    
            if (fundTokenAllocationInfo.tokenBalance == BIG_DECIMAL_ZERO) {
              fundTokenAllocationInfo.tokenBalance = incomingAssetBalances[i].toBigDecimal();
              log.warning("incomigAssets 0 {}",[incomingAssets[0].toHexString()]);
            } else
                fundTokenAllocationInfo.tokenBalance = fundTokenAllocationInfo.tokenBalance.plus(incomingAssetBalances[i].toBigDecimal());
            fundTokenAllocationInfo.tokenInfo = getOrCreateAsset(incomingAssets[i]).id;
            fundTokenAllocationInfo.vaultProxy = comptrollerContractInstance.vaultProxy();
            fundTokenAllocationInfo.save();
            let vaultInstance = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString());
            vaultInstance.assetsBreakup = vaultInstance.assetsBreakup.concat([fundTokenAllocationInfo.id]);
            vaultInstance.save();
        }
        
        if (i < outgoingAssets.length) {
            integrationsdata.outgoingAsset = arrayUnique<string>(integrationsdata.outgoingAsset.concat([getOrCreateAsset(outgoingAssets[i]).id]));
            integrationsdata.outgoingAssetBalance = arrayUnique<string>(integrationsdata.outgoingAssetBalance.concat([outgoingAssetBalances[i].toHexString()]));
            
            

            let tokenIdOut = getFundTokenAllocationId(comptrollerContractInstance.vaultProxy(), outgoingAssets[i]);
            let fundTokenAllocationInfoOut = getOrCreateFundTokenAllocation(tokenIdOut, comptrollerContractInstance.vaultProxy(), outgoingAssets[i]);
            if(fundTokenAllocationInfoOut.tokenBalance == BIG_DECIMAL_ZERO)
            {
                fundTokenAllocationInfoOut.tokenBalance = outgoingAssetBalances[i].toBigDecimal();
                log.warning("outgoingAssets 0 {}",[outgoingAssets[0].toHexString()]);
            } else
                fundTokenAllocationInfoOut.tokenBalance = fundTokenAllocationInfoOut.tokenBalance.minus(outgoingAssetBalances[i].toBigDecimal());
            fundTokenAllocationInfoOut.tokenInfo = getOrCreateAsset(outgoingAssets[i]).id;
            fundTokenAllocationInfoOut.vaultProxy = comptrollerContractInstance.vaultProxy();
            fundTokenAllocationInfoOut.save();
            let vaultInstance1 = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString());
            vaultInstance1.assetsBreakup = vaultInstance1.assetsBreakup.concat([fundTokenAllocationInfoOut.id]);
            vaultInstance1.save();
        }
        
    }
    integrationsdata.save();
    
}