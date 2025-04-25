import { UserROI } from "../../generated/schema";
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { ComptrollerLogic } from "../../generated/templates/ComptrollerLogic/ComptrollerLogic"
import { getInvestorReturnsId } from "../utils/id_generator";


export function getOrCreateInvestorRoi(comptrollerContractInstance: ComptrollerLogic, userAddress: Address): UserROI {

    let returnsId = getInvestorReturnsId(userAddress,
        comptrollerContractInstance.vaultProxy(), 
        comptrollerContractInstance.performanceFeeBps(),
        comptrollerContractInstance.managementFeeBps());
    let roiInvestor = UserROI.load(returnsId);
    if (roiInvestor == null) {
        roiInvestor = new UserROI(returnsId);
        var investDetails = comptrollerContractInstance.getInvestorInvestments(userAddress);
        // 100000000 is SHARES_UNIT;
        // avg share price is -> investment amount in $  (including fees)/ shares owned (including fees)
        roiInvestor.avgSharePrice = (investDetails.getValue2().times(BigInt.fromString("100000000")).toBigDecimal()).
                                div(investDetails.getValue1().toBigDecimal());
        roiInvestor.currentSharePrice = comptrollerContractInstance.getSharePrice().toBigDecimal();
        roiInvestor.sharesOwned = investDetails.getValue1().toBigDecimal();
        var currentValue = roiInvestor.currentSharePrice.times(roiInvestor.sharesOwned);
        var totalInitialValue = roiInvestor.avgSharePrice.times(roiInvestor.sharesOwned);
        roiInvestor.returns = currentValue.minus(totalInitialValue);
        roiInvestor.user = userAddress;
    }
    roiInvestor.save();
    return roiInvestor;
}