import { FeeShares, FundFees, FeesEarned} from "../../generated/schema";
import { BIG_DECIMAL_ZERO } from "../utils/constants";
import { ComptrollerLogic } from "../../generated/templates/ComptrollerLogic/ComptrollerLogic"
import { getFundFeeSharesId, getFundFeesId, getFeesEarnedId } from "../utils/id_generator";
import { getActivityCounter } from "../utils/Counter";
import { getOrCreateFund } from "../entities/fund";
import { BigInt, Address } from "@graphprotocol/graph-ts";

export function getOrCreateFeeShares(comptrollerContractInstance: ComptrollerLogic, userAddress: Address,sharesQuantity: BigInt): FeeShares {
    let feesSharesId = getFundFeeSharesId(comptrollerContractInstance.vaultProxy(),
                                          comptrollerContractInstance.performanceFeeBps(),
                                          sharesQuantity);
    let feesShares = FeeShares.load(feesSharesId);
    if (feesShares == null) {
        feesShares = new FeeShares(feesSharesId); 
        feesShares.perfFees = BIG_DECIMAL_ZERO;
        feesShares.manageFees = BIG_DECIMAL_ZERO;
        feesShares.protocolFees = BIG_DECIMAL_ZERO;
        feesShares.sharePrice = BIG_DECIMAL_ZERO;
        feesShares.investorAddress = userAddress;
    }
    feesShares.save();
  return feesShares;
}

export function getOrCreateFundFees(comptrollerContractInstance: ComptrollerLogic, perfFee: BigInt): FundFees {
    let feesId = getFundFeesId(comptrollerContractInstance.fundManager(),
                              comptrollerContractInstance.vaultProxy(), 
                              perfFee);
    let fundFees = FundFees.load(feesId);
    if (fundFees == null) {
        fundFees = new FundFees(feesId);
        fundFees.eventName = "PerfManagementFeePolicySet";
        fundFees.feesDue = BIG_DECIMAL_ZERO;
        fundFees.totalPerformanceFees = BIG_DECIMAL_ZERO;
        fundFees.totalManagementFees = BIG_DECIMAL_ZERO; 
        fundFees.feeInShares = '';
    }
    fundFees.activityCounter = getActivityCounter();
    fundFees.activityCategories = ['Vault'];
    fundFees.activityType = 'Trade';
    fundFees.vault = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString()).id;
    return fundFees;
}

export function updateFundFees(comptrollerContractInstance: ComptrollerLogic, feesShares: FeeShares) : void {
    let feesId = getFundFeesId(comptrollerContractInstance.fundManager(),
                                comptrollerContractInstance.vaultProxy(), 
                                comptrollerContractInstance.performanceFeeBps());
    let fundFees = FundFees.load(feesId);
    if(fundFees != null) {
        fundFees.feeInShares =feesShares.id;
        fundFees.save();
    }
}

export function getOrCreateFeesEarnedShares(comptrollerContractInstance: ComptrollerLogic): FeesEarned {
    let feesEarnedSharesId = getFeesEarnedId(comptrollerContractInstance.fundManager(),comptrollerContractInstance.vaultProxy());
    let feesEarnedShares = FeesEarned.load(feesEarnedSharesId);
    if (feesEarnedShares == null) {
        feesEarnedShares = new FeesEarned(feesEarnedSharesId); 
        feesEarnedShares.totalPerfFeesEarned = BIG_DECIMAL_ZERO;
        feesEarnedShares.totalManageFeesEarned = BIG_DECIMAL_ZERO;
        feesEarnedShares.totalFmShares = BIG_DECIMAL_ZERO;
    }
    feesEarnedShares.save();
  return feesEarnedShares;
}