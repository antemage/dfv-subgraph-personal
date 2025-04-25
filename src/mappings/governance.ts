import {
  FeeBpsSet as FeeBpsSetEvent,
  ProtocolFeePaidInShares as ProtocolFeePaidInSharesEvent
} from "../../generated/Governance/Governance"
import { FundProtocolFeesSet, ProtocolFeesPaid } from "../../generated/schema"
import { generateId} from "../utils/id_generator";
import { getTransactionDetails } from "../entities/transaction";
import { getActivityCounter } from "../utils/Counter";

export function handleFeeBpsSet(event: FeeBpsSetEvent): void {
  let entity = new FundProtocolFeesSet(generateId(event));
  entity.eventName = "ProtocolFeePolicySet";
  entity.protocolPerfFees = event.params.perfFeeBps.toBigDecimal();
  entity.protocolAumFees = event.params.aumFeeBps.toBigDecimal();
  entity.timestamp = event.block.timestamp;
  entity.transaction = getTransactionDetails(event).id;
  entity.activityCounter = getActivityCounter();
  entity.activityCategories = ['Network'];
  entity.activityType = 'Trade';
  entity.save();
    //fundFees.vault = getOrCreateFund(comptrollerContractInstance.vaultProxy().toHexString()).id;  
}

export function handleProtocolFeePaidInShares(
  event: ProtocolFeePaidInSharesEvent
): void {
  let entity = new ProtocolFeesPaid(generateId(event));
  entity.eventName = "ProtocolFeePolicySet";
  entity.protocolFeeShares = event.params.sharesDue.toBigDecimal();
  entity.timestamp = event.block.timestamp;
  entity.transaction = getTransactionDetails(event).id;
  entity.activityCounter = getActivityCounter();
  entity.activityCategories = ['Network'];
  entity.activityType = 'Trade';
  entity.save();
}
