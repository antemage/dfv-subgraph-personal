import { Investor, InvestorFundCount } from "../../generated/schema";
import { ComptrollerLogic } from "../../generated/templates/ComptrollerLogic/ComptrollerLogic";
import { Address,log } from '@graphprotocol/graph-ts';
import { getInvestorId, getInvestorFundId } from "../utils/id_generator";
import { getOrCreateAggregation, 
          getOrCreateFundDetails } from "../entities/fund";
import { BIG_DECIMAL_ZERO, BIG_DECIMAL_ONE, BIG_INT_ZERO, BIG_INT_ONE } from "../utils/constants";
//import { getInvestorFundCount } from "../utils/Counter";

export function getOrCreateInvestorDetails(comptrollerContractInstance: ComptrollerLogic, userAddress: Address): Investor {

  let investorId = getInvestorId(comptrollerContractInstance.vaultProxy(), userAddress);
  let investorFundId = getInvestorFundId(userAddress);

  let investorDetails = Investor.load(investorId);
  let investorFundCountDetails = InvestorFundCount.load(investorFundId);
  if (investorDetails == null) {

    investorDetails = new Investor(investorId);
    investorDetails.investmentAmount = BIG_DECIMAL_ZERO;
    investorDetails.totalFundsCount = '';
    investorDetails.highWaterMark = BIG_DECIMAL_ZERO;
    investorDetails.sharesOwned = BIG_DECIMAL_ZERO;
    investorDetails.roi = '';
    
    
    let funddetails = getOrCreateFundDetails(comptrollerContractInstance);
    funddetails.investorsCount = funddetails.investorsCount.plus(BIG_INT_ONE);
    funddetails.save();

    
    if (investorFundCountDetails == null) {
        investorFundCountDetails = new InvestorFundCount(investorFundId);
        investorFundCountDetails.count = 0;
        let aggregationInstance = getOrCreateAggregation(BIG_DECIMAL_ONE.toString());
        aggregationInstance.totalInvestors = aggregationInstance.totalInvestors.plus(BIG_INT_ONE);
        aggregationInstance.save();
    }
    
    investorFundCountDetails.count = investorFundCountDetails.count + 1;
    //log.warning("Actual Fund Count called {}",[investorFundCountDetails.count.toString()]);
    
    investorFundCountDetails.save();
    
  }
  if(investorFundCountDetails != null)
    investorDetails.totalFundsCount = investorFundCountDetails.id;

  investorDetails.user = userAddress;  
  var investDetails = comptrollerContractInstance.getInvestorInvestments(userAddress);
  investorDetails.highWaterMark = investDetails.getValue0().toBigDecimal();
  investorDetails.sharesOwned = investDetails.getValue1().toBigDecimal();
  investorDetails.investmentAmount = investDetails.getValue2().toBigDecimal();
  return investorDetails;
}
 
