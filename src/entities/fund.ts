import { Fund, Aggregation, FundDetails, FundFees, FundTokenAllocation } from "../../generated/schema";
import { ERC20 } from "../../generated/templates/ComptrollerLogic/ERC20";
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO } from "../utils/constants";
import { Address } from '@graphprotocol/graph-ts';
import { ComptrollerLogic } from "../../generated/templates/ComptrollerLogic/ComptrollerLogic"
import { getFundDetailsId } from "../utils/id_generator";
import { UserToken } from "../../generated/templates/ComptrollerLogic/UserToken"; 
import { arrayUnique } from "../utils/helper";
import { log } from "@graphprotocol/graph-ts";

export function getOrCreateFundDetails(comptrollerContractInstance: ComptrollerLogic): FundDetails {
  let fundDetailsId = getFundDetailsId(comptrollerContractInstance.fundManager(),comptrollerContractInstance.vaultProxy());
  let tokenProxy = comptrollerContractInstance.tokenProxy();
  const tokenContractInstance = UserToken.bind(tokenProxy);
  let funddetails = FundDetails.load(fundDetailsId);
  if (funddetails == null) {
    funddetails = new FundDetails(fundDetailsId);
    
    funddetails.sharesSupply = BIG_DECIMAL_ZERO;
    funddetails.fees = '';
    funddetails.feeSharesEarned = '';
    funddetails.investorsCount = BIG_INT_ZERO;
    funddetails.fmaddress = comptrollerContractInstance.fundManager();
    funddetails.timestamp = BIG_INT_ZERO; 
  }
  funddetails.sharesSupply = tokenContractInstance.totalMintedShares().toBigDecimal();
  funddetails.save(); 
  
  return funddetails;
}

export function updateFund(comptrollerContractInstance: ComptrollerLogic, fundDetails: FundDetails, fundAlloc: FundTokenAllocation) : void {
    let vaultInstance = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString());
    if (fundDetails != null)
      vaultInstance.fmdetails = fundDetails.id;
    if (fundAlloc != null)
      vaultInstance.assetsBreakup = arrayUnique<string>(vaultInstance.assetsBreakup.concat([fundAlloc.id]));

    vaultInstance.save();
}

export function updateFundDetails(comptrollerContractInstance: ComptrollerLogic, fundFees: FundFees) : void {
  let funddetails = getOrCreateFundDetails(comptrollerContractInstance);
  if (fundFees != null)
      funddetails.fees = fundFees.id;
  //log.warning("FundDetails called {}",[funddetails.fees.toString()]);
  funddetails.save();
  let vaultInstance = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString());
    if (funddetails != null)
      vaultInstance.fmdetails = funddetails.id;
  vaultInstance.save();
}
  

  
  export function getOrCreateFund(id: string): Fund {
    let vault = Fund.load(id) as Fund;
    if (vault == null) {
      //error
    }
  
    return vault;
  }
  
  export function getOrCreateAggregation(id: string): Aggregation {
    let aggregation = Aggregation.load(id) as Aggregation;
    if (aggregation == null) {
      //error
    }
  
    return aggregation;
  }

  export function getOrCreateFundTokenAllocation(id: string, vaultAddress: Address, assetAddress: Address): FundTokenAllocation {
    let fundTokenAllocation = FundTokenAllocation.load(id);
    
    if (fundTokenAllocation == null) {
      fundTokenAllocation = new FundTokenAllocation(id);
      fundTokenAllocation.tokenBalance = BIG_DECIMAL_ZERO;
    }
    let contract = ERC20.bind(assetAddress);
    fundTokenAllocation.assetBalance = contract.try_balanceOf(vaultAddress).value.toBigDecimal();
    return fundTokenAllocation;
  }