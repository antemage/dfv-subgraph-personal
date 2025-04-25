import { ComptrollerLogic, RedeemSharesInKindCall } from "../../generated/templates/ComptrollerLogic/ComptrollerLogic"
import { SharesBought, 
        SharesRedeemedSingleAsset,
        FeePolicySet,
        FeeClaimed,
        WithdrawPolicySet,
        SharesWithdrawn
      } from "../../generated/templates/ComptrollerLogic/ComptrollerLogic";
import { getOrCreateFund,  
          getOrCreateFundDetails, 
          getOrCreateFundTokenAllocation,
          updateFund,
          updateFundDetails  } from "../entities/fund";
import {getOrCreateFundFees, getOrCreateFeesEarnedShares} from "../entities/fee";          
import { getOrCreateInvestorDetails } from "../entities/investor";
import { getOrCreateInvestorRoi } from "../entities/returns";

import { getOrCreateAsset } from "../entities/asset";
import { getOrCreateFeeShares, updateFundFees } from "../entities/fee";
import { getTransactionDetails } from "../entities/transaction";

import { generateId, 
          getInvestorId, 
          getFundTokenAllocationId 
          } from "../utils/id_generator";
import {  SharesBoughtEvent, 
          SharesRedeemedSingleAssetEvent,
          FundInvestor,
          WithdrawalPolicyEvent,
          SharesWithdrawnEvent} from "../../generated/schema";
import { getActivityCounter } from "../utils/Counter";
import { log } from '@graphprotocol/graph-ts';
import { BIG_INT_ONE } from "../utils/constants";

export function handleSharesBought(event: SharesBought): void {

  const comptrollerContractInstance = ComptrollerLogic.bind(event.address);
  
  let buyerSharesEventData = new SharesBoughtEvent(generateId(event));
  buyerSharesEventData.buyerAddr = event.params.buyer;
  buyerSharesEventData.vault = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString()).id;
  
  buyerSharesEventData.depositAsset = getOrCreateAsset(event.params.buyAssetAddress).id;
  buyerSharesEventData.investmentAmount = event.params.investmentAmount.toBigDecimal();
  buyerSharesEventData.sharesIssued = event.params.sharesReturned.toBigDecimal();
  buyerSharesEventData.tokensTransferred = event.params.tokensTranferred.toBigDecimal();
  buyerSharesEventData.timestamp = event.block.timestamp;
  buyerSharesEventData.eventName = 'Deposit';
  buyerSharesEventData.transaction = getTransactionDetails(event).id;
  buyerSharesEventData.activityCounter = getActivityCounter();
  buyerSharesEventData.activityCategories = ['Vault'];
  buyerSharesEventData.activityType = 'Trade';
  buyerSharesEventData.save();
  
  let funddetails = getOrCreateFundDetails(comptrollerContractInstance);
  funddetails.timestamp = event.block.timestamp; 
  let feesEarnedShares = getOrCreateFeesEarnedShares(comptrollerContractInstance);
  feesEarnedShares.totalPerfFeesEarned = feesEarnedShares.totalPerfFeesEarned.plus(event.params.performanceFee.toBigDecimal());
  feesEarnedShares.totalManageFeesEarned = feesEarnedShares.totalManageFeesEarned.plus(event.params.managementFee.toBigDecimal());
  var investDetails = comptrollerContractInstance.getInvestorInvestments(comptrollerContractInstance.fundManager());
  feesEarnedShares.totalFmShares = investDetails.getValue1().toBigDecimal().plus(comptrollerContractInstance.getFundManagerShares().toBigDecimal()); 
  feesEarnedShares.save()
  funddetails.feeSharesEarned = feesEarnedShares.id;
  funddetails.save();
  let investorDetails = getOrCreateInvestorDetails(comptrollerContractInstance, event.params.buyer);
  investorDetails.timestamp = event.block.timestamp;
  investorDetails.save();
  
  let tokenId = getFundTokenAllocationId(comptrollerContractInstance.vaultProxy(), event.params.buyAssetAddress);
  let fundTokenAllocationInfo = getOrCreateFundTokenAllocation(tokenId, comptrollerContractInstance.vaultProxy(), event.params.buyAssetAddress);
  if(fundTokenAllocationInfo != null) {
    fundTokenAllocationInfo.tokenBalance = fundTokenAllocationInfo.tokenBalance.plus(event.params.tokensTranferred.toBigDecimal());
    fundTokenAllocationInfo.tokenInfo = getOrCreateAsset(event.params.buyAssetAddress).id;
    fundTokenAllocationInfo.vaultProxy = comptrollerContractInstance.vaultProxy();
    fundTokenAllocationInfo.save();
  }
  updateFund(comptrollerContractInstance, funddetails, fundTokenAllocationInfo);

  let investorId = getInvestorId(comptrollerContractInstance.vaultProxy(), event.params.buyer);
  let fundInvestor = FundInvestor.load(investorId);
  if (fundInvestor == null) {
    fundInvestor = new FundInvestor(investorId);
    
  }
  fundInvestor.investor = investorDetails.id;
  fundInvestor.fund = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString()).id;
  fundInvestor.save();
  let feesShares = getOrCreateFeeShares(comptrollerContractInstance, event.params.buyer, event.params.sharesReturned);
  feesShares.perfFees = event.params.performanceFee.toBigDecimal();
  feesShares.manageFees = event.params.managementFee.toBigDecimal();
  feesShares.protocolFees = event.params.protocolFee.toBigDecimal();
  feesShares.sharePrice = event.params._sharePrice.toBigDecimal();
  feesShares.investorAddress = event.params.buyer;
  feesShares.save();
  updateFundFees(comptrollerContractInstance, feesShares);

  let roiInvestor = getOrCreateInvestorRoi(comptrollerContractInstance, event.params.buyer);
  investorDetails.roi = roiInvestor.id;
  investorDetails.save();
}

export function handleSharesRedeemedSingleAsset(event: SharesRedeemedSingleAsset): void {
  let redeemShares = new SharesRedeemedSingleAssetEvent(generateId(event));
  const comptrollerContractInstance = ComptrollerLogic.bind(event.address);

  redeemShares.vault = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString()).id;
  redeemShares.eventName = 'Withdraw';
  redeemShares.redeemer = event.params.redeemer;
  redeemShares.sharesRedeemed = event.params.sharesRedeemed.toBigDecimal();
  redeemShares.tokensWithdrawn = event.params.tokensRedeemed.toBigDecimal();
  redeemShares.redeemedAsset = getOrCreateAsset(event.params.redeemedAssetAddress).id;
  redeemShares.timestamp = event.block.timestamp;
  redeemShares.transaction = getTransactionDetails(event).id;
  redeemShares.activityCounter = getActivityCounter();
  redeemShares.activityCategories = ['Vault'];
  redeemShares.activityType = 'Trade';
  redeemShares.save();

  
}

export function handleFeePolicySet(event: FeePolicySet): void {
  const comptrollerContractInstance = ComptrollerLogic.bind(event.address);
  let fundFees = getOrCreateFundFees(comptrollerContractInstance, event.params.performanceFeeBps);
  fundFees.performanceFees = event.params.performanceFeeBps.toBigDecimal();
  fundFees.managementFees = event.params.managementFeeBps.toBigDecimal();
 
  fundFees.transaction = getTransactionDetails(event).id;
  fundFees.timestamp = event.block.timestamp;
  fundFees.totalPerformanceFees = fundFees.totalPerformanceFees.plus(fundFees.performanceFees);
  fundFees.totalManagementFees = fundFees.totalManagementFees.plus(fundFees.managementFees);
  fundFees.save();
  updateFundDetails(comptrollerContractInstance, fundFees);
  
}

export function handleFeeClaimed(event: FeeClaimed): void {
  const comptrollerContractInstance = ComptrollerLogic.bind(event.address);
  let feesShares = getOrCreateFeeShares(comptrollerContractInstance, event.params.investorAddress, BIG_INT_ONE);

  feesShares.perfFees = event.params.performanceFee.toBigDecimal();
  feesShares.manageFees = event.params.managementFee.toBigDecimal();
  feesShares.protocolFees = event.params.protocolFee.toBigDecimal();
  feesShares.sharePrice = event.params.sharePrice.toBigDecimal();
  feesShares.investorAddress = event.params.investorAddress;
  feesShares.save();
  let fundFees = getOrCreateFundFees(comptrollerContractInstance, event.params.performanceFeeBps);
  fundFees.eventName = 'FeeClaimed';
  fundFees.save();
  let funddetails = getOrCreateFundDetails(comptrollerContractInstance);
  funddetails.timestamp = event.block.timestamp; 
  let feesEarnedShares = getOrCreateFeesEarnedShares(comptrollerContractInstance);
  feesEarnedShares.totalPerfFeesEarned = feesEarnedShares.totalPerfFeesEarned.plus(event.params.performanceFee.toBigDecimal());
  feesEarnedShares.totalManageFeesEarned = feesEarnedShares.totalManageFeesEarned.plus(event.params.managementFee.toBigDecimal());
  var investDetails = comptrollerContractInstance.getInvestorInvestments(comptrollerContractInstance.fundManager());
  feesEarnedShares.totalFmShares = investDetails.getValue1().toBigDecimal().plus(comptrollerContractInstance.getFundManagerShares().toBigDecimal()); 
  feesEarnedShares.save()
  funddetails.feeSharesEarned = feesEarnedShares.id;
  funddetails.save();
  updateFundDetails(comptrollerContractInstance, fundFees);      
  updateFundFees(comptrollerContractInstance, feesShares);

  let investorDetails = getOrCreateInvestorDetails(comptrollerContractInstance, event.params.investorAddress);
  investorDetails.fees = fundFees.id;
  investorDetails.timestamp = event.block.timestamp;

  let roiInvestor = getOrCreateInvestorRoi(comptrollerContractInstance, event.params.investorAddress);
  investorDetails.roi = roiInvestor.id;
  investorDetails.save();


  
}

export function handleWithdrawalPolicyEvent(event: WithdrawPolicySet): void {
  const comptrollerContractInstance = ComptrollerLogic.bind(event.address);
  let withdrawPolicyId = generateId(event);
  let withdrawalPolicy = WithdrawalPolicyEvent.load(withdrawPolicyId);
  if (withdrawalPolicy == null) {
      withdrawalPolicy = new WithdrawalPolicyEvent(withdrawPolicyId);
      withdrawalPolicy.redemptionFees = event.params.withdrawFeeBps.toBigDecimal();
      withdrawalPolicy.sharesLockPeriod = event.params.sharesLockupPeriod;
      withdrawalPolicy.timestamp = event.block.timestamp;
      withdrawalPolicy.transaction = getTransactionDetails(event).id;
      withdrawalPolicy.activityCounter = getActivityCounter();
      withdrawalPolicy.activityCategories = ['Vault'];
      withdrawalPolicy.activityType = 'Trade';
      withdrawalPolicy.eventName = 'WithdrawPolicySet';
      withdrawalPolicy.vault = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString()).id;
  }
  withdrawalPolicy.save();
}

export function handleSharesWithdraw(event: SharesWithdrawn): void {
    let withdrawShares = new SharesWithdrawnEvent(generateId(event));
    const comptrollerContractInstance = ComptrollerLogic.bind(event.address);
  
    withdrawShares.vault = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString()).id;
    withdrawShares.eventName = 'Withdraw';
    withdrawShares.redeemer = event.params.redeemer;

    if(event.params.redeemType == 0) {
      withdrawShares.redeemType = 'SingleAsset';
    } else 
      withdrawShares.redeemType = 'InKind';

    withdrawShares.sharesRedeemed = event.params.redeemSharesQuantity.toBigDecimal();
    withdrawShares.tokensWithdrawn = event.params.tokensToWithdraw.toBigDecimal();
    withdrawShares.redeemedAsset = getOrCreateAsset(event.params.withdrawAsset).id;
    withdrawShares.timestamp = event.block.timestamp;
    withdrawShares.transaction = getTransactionDetails(event).id;
    withdrawShares.activityCounter = getActivityCounter();
    withdrawShares.activityCategories = ['Vault'];
    withdrawShares.activityType = 'Trade';
    
    let feesShares = getOrCreateFeeShares(comptrollerContractInstance, event.params.redeemer, event.params.redeemSharesQuantity);
    log.warning("AUM shares {}",[event.params.managementFee.toString()]);
    feesShares.perfFees = event.params.performanceFee.toBigDecimal();
    feesShares.manageFees = event.params.managementFee.toBigDecimal();
    feesShares.protocolFees = event.params.protocolFee.toBigDecimal();
    feesShares.sharePrice = event.params.sharePrice.toBigDecimal();
    feesShares.investorAddress = event.params.redeemer;
    feesShares.save();     
    
    updateFundFees(comptrollerContractInstance, feesShares);
    withdrawShares.feeInShares = feesShares.id;
    withdrawShares.save();

    let investorDetails = getOrCreateInvestorDetails(comptrollerContractInstance, event.params.redeemer);
    investorDetails.timestamp = event.block.timestamp;
    investorDetails.save();

    let tokenId = getFundTokenAllocationId(comptrollerContractInstance.vaultProxy(), event.params.withdrawAsset);
    let fundTokenAllocationInfo = getOrCreateFundTokenAllocation(tokenId, comptrollerContractInstance.vaultProxy(), event.params.withdrawAsset);
    if(fundTokenAllocationInfo != null) {
        fundTokenAllocationInfo.tokenBalance = fundTokenAllocationInfo.tokenBalance.minus(event.params.tokensToWithdraw.toBigDecimal());
        fundTokenAllocationInfo.tokenInfo = getOrCreateAsset(event.params.withdrawAsset).id;
        fundTokenAllocationInfo.vaultProxy = comptrollerContractInstance.vaultProxy();
        fundTokenAllocationInfo.save();  
    }

    let funddetails = getOrCreateFundDetails(comptrollerContractInstance);
    funddetails.timestamp = event.block.timestamp; 
    let feesEarnedShares = getOrCreateFeesEarnedShares(comptrollerContractInstance);
    feesEarnedShares.totalPerfFeesEarned = feesEarnedShares.totalPerfFeesEarned.plus(event.params.performanceFee.toBigDecimal());
    feesEarnedShares.totalManageFeesEarned = feesEarnedShares.totalManageFeesEarned.plus(event.params.managementFee.toBigDecimal());
    var investDetails = comptrollerContractInstance.getInvestorInvestments(comptrollerContractInstance.fundManager());
    feesEarnedShares.totalFmShares = investDetails.getValue1().toBigDecimal().plus(comptrollerContractInstance.getFundManagerShares().toBigDecimal()); 
    feesEarnedShares.save()
    funddetails.feeSharesEarned = feesEarnedShares.id;
    funddetails.save();
    updateFund(comptrollerContractInstance, funddetails, fundTokenAllocationInfo);

    let roiInvestor = getOrCreateInvestorRoi(comptrollerContractInstance, event.params.redeemer);
    investorDetails.roi = roiInvestor.id;
    investorDetails.save();
}


