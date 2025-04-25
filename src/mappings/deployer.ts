import {
  NewFundCreated,
  Deployer
} from "../../generated/Deployer/Deployer";
import {
  NewVaultDeployed
} from "../../generated/Dispatcher/Dispatcher";
import { Fund, Aggregation, DepositLimit } from "../../generated/schema";
import { Vault as VaultTemplate, ComptrollerLogic } from "../../generated/templates";
import { getTransactionDetails } from "../entities/transaction";
import { BIG_INT_ZERO, BIG_INT_ONE, ZERO_ADDRESS } from "../utils/constants";
import { getOrCreateAsset } from "../entities/asset";
import { generateId } from "../utils/id_generator";
import { log } from "@graphprotocol/graph-ts";

export function handleNewVaultDeployed(event: NewFundCreated): void {
  const deployerInstance = Deployer.bind(event.address);
  const vaultAddress = event.params.vaultProxy;
  let vaultInstance = Fund.load(vaultAddress.toHexString());

  if (vaultInstance == null) {
    vaultInstance = new Fund(vaultAddress.toHexString());

    vaultInstance.fundName = event.params.vaultFundName;
    const denominationAsset = deployerInstance.try_denominationAsset();

    if (denominationAsset.reverted) {
      // Handle reverted call
      log.info('denominationAsset call reverted', []);
      vaultInstance.denominationAsset = getOrCreateAsset(ZERO_ADDRESS).id;
    } else {
      if(!denominationAsset.reverted) {        
        vaultInstance.denominationAsset = getOrCreateAsset(denominationAsset.value).id

      }
    }
    
    let depositLimitInstance = DepositLimit.load(generateId(event));
    if(depositLimitInstance == null) {
      depositLimitInstance = new DepositLimit(generateId(event));      
    }
    depositLimitInstance.minimumLimit = event.params.fundDepositLimit;
    depositLimitInstance.maximumLimit = BIG_INT_ZERO;
    vaultInstance.depositLimit = depositLimitInstance.id;
    depositLimitInstance.save();
    vaultInstance.date = event.block.timestamp;
    vaultInstance.owner = event.params.creator;
    vaultInstance.comptrollerProxy = event.params.comptrollerProxy;
    vaultInstance.vaultProxy = event.params.vaultProxy;
    vaultInstance.tokenProxy = event.params.tokenProxy;
    if (event.params.fundType) {
      vaultInstance.fundType = 'Private';
    } else 
      vaultInstance.fundType = 'Public';
    vaultInstance.fmdetails = '';
    vaultInstance.assets = [];
    //vaultInstance.denominationAsset = deployerContractInstance.denominationAsset();
    vaultInstance.eventName = "NewFundCreated";
    vaultInstance.assetsBreakup = [];
    vaultInstance.transaction = getTransactionDetails(event).id;
    vaultInstance.timestamp = event.block.timestamp;
  } else {
    vaultInstance.tokenProxy = event.params.tokenProxy;
    //UserTokenTemplate.create(Address.fromBytes(vaultInstance.tokenProxy));
  }
  
  vaultInstance.save();
  
  let aggregationInstance = Aggregation.load(BIG_INT_ONE.toString());

  if(aggregationInstance == null) {
    aggregationInstance = new Aggregation(BIG_INT_ONE.toString());
    aggregationInstance.totalFunds = BIG_INT_ZERO;
    aggregationInstance.totalInvestors = BIG_INT_ZERO;
  }

  aggregationInstance.totalFunds = aggregationInstance.totalFunds.plus(BIG_INT_ONE);

  aggregationInstance.save();

  VaultTemplate.create(vaultAddress);

  ComptrollerLogic.create(event.params.comptrollerProxy);

}

export function handleDispatcherNewVaultDeployed(event: NewVaultDeployed): void {

  const vaultAddress = event.params.proxy;

  let vaultInstance = Fund.load(vaultAddress.toHexString());

  if (vaultInstance == null) {
    vaultInstance = new Fund(vaultAddress.toHexString());
  }

}

