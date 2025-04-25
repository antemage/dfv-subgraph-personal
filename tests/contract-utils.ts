import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  ExternalAdapterPairAdded,
  IntegrationCalledForVault,
  ProxyPairAdded
} from "../generated/Contract/Contract"

export function createExternalAdapterPairAddedEvent(
  _externalContract: Address,
  _adapterContract: Address
): ExternalAdapterPairAdded {
  let externalAdapterPairAddedEvent = changetype<ExternalAdapterPairAdded>(
    newMockEvent()
  )

  externalAdapterPairAddedEvent.parameters = new Array()

  externalAdapterPairAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_externalContract",
      ethereum.Value.fromAddress(_externalContract)
    )
  )
  externalAdapterPairAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_adapterContract",
      ethereum.Value.fromAddress(_adapterContract)
    )
  )

  return externalAdapterPairAddedEvent
}

export function createIntegrationCalledForVaultEvent(
  comptrollerProxy: Address,
  adapter: Address,
  selector: Bytes,
  incomingAsset: Array<Address>,
  incomingAssetBalance: Array<BigInt>,
  outgoingAsset: Array<Address>,
  outgoingAssetBalance: Array<BigInt>
): IntegrationCalledForVault {
  let integrationCalledForVaultEvent = changetype<IntegrationCalledForVault>(
    newMockEvent()
  )

  integrationCalledForVaultEvent.parameters = new Array()

  integrationCalledForVaultEvent.parameters.push(
    new ethereum.EventParam(
      "comptrollerProxy",
      ethereum.Value.fromAddress(comptrollerProxy)
    )
  )
  integrationCalledForVaultEvent.parameters.push(
    new ethereum.EventParam("adapter", ethereum.Value.fromAddress(adapter))
  )
  integrationCalledForVaultEvent.parameters.push(
    new ethereum.EventParam("selector", ethereum.Value.fromFixedBytes(selector))
  )
  integrationCalledForVaultEvent.parameters.push(
    new ethereum.EventParam(
      "incomingAsset",
      ethereum.Value.fromAddressArray(incomingAsset)
    )
  )
  integrationCalledForVaultEvent.parameters.push(
    new ethereum.EventParam(
      "incomingAssetBalance",
      ethereum.Value.fromUnsignedBigIntArray(incomingAssetBalance)
    )
  )
  integrationCalledForVaultEvent.parameters.push(
    new ethereum.EventParam(
      "outgoingAsset",
      ethereum.Value.fromAddressArray(outgoingAsset)
    )
  )
  integrationCalledForVaultEvent.parameters.push(
    new ethereum.EventParam(
      "outgoingAssetBalance",
      ethereum.Value.fromUnsignedBigIntArray(outgoingAssetBalance)
    )
  )

  return integrationCalledForVaultEvent
}

export function createProxyPairAddedEvent(
  _comptrollerProxy: Address,
  _vaultProxy: Address
): ProxyPairAdded {
  let proxyPairAddedEvent = changetype<ProxyPairAdded>(newMockEvent())

  proxyPairAddedEvent.parameters = new Array()

  proxyPairAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_comptrollerProxy",
      ethereum.Value.fromAddress(_comptrollerProxy)
    )
  )
  proxyPairAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_vaultProxy",
      ethereum.Value.fromAddress(_vaultProxy)
    )
  )

  return proxyPairAddedEvent
}
