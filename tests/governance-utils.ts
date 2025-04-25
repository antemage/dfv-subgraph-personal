import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import {
  FeeBpsSet,
  ProtocolFeePaidInShares
} from "../generated/Governance/Governance"

export function createFeeBpsSetEvent(
  aumFeeBps: BigInt,
  perfFeeBps: BigInt
): FeeBpsSet {
  let feeBpsSetEvent = changetype<FeeBpsSet>(newMockEvent())

  feeBpsSetEvent.parameters = new Array()

  feeBpsSetEvent.parameters.push(
    new ethereum.EventParam(
      "aumFeeBps",
      ethereum.Value.fromUnsignedBigInt(aumFeeBps)
    )
  )
  feeBpsSetEvent.parameters.push(
    new ethereum.EventParam(
      "perfFeeBps",
      ethereum.Value.fromUnsignedBigInt(perfFeeBps)
    )
  )

  return feeBpsSetEvent
}

export function createProtocolFeePaidInSharesEvent(
  sharesDue: BigInt
): ProtocolFeePaidInShares {
  let protocolFeePaidInSharesEvent = changetype<ProtocolFeePaidInShares>(
    newMockEvent()
  )

  protocolFeePaidInSharesEvent.parameters = new Array()

  protocolFeePaidInSharesEvent.parameters.push(
    new ethereum.EventParam(
      "sharesDue",
      ethereum.Value.fromUnsignedBigInt(sharesDue)
    )
  )

  return protocolFeePaidInSharesEvent
}
