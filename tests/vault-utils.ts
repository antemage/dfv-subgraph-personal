import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  DepositAssetAdded
} from "../generated/templates/ComptrollerLogic/ComptrollerLogic"

export function createNewAssetAdded(
  asset: Address,
): DepositAssetAdded {
  let depositAssetAddedEvent = changetype<DepositAssetAdded>(newMockEvent())

  depositAssetAddedEvent.parameters = new Array()

  depositAssetAddedEvent.parameters.push(
    new ethereum.EventParam(
      "_asset",
      ethereum.Value.fromAddress(asset)
    )
  )

  return depositAssetAddedEvent;
}

// export function createNewVaultDeployedEvent(
//   deployer: Address,
//   fundOwner: Address,
//   proxy: Address,
//   comptroller: Address,
//   vaultImplementation: Address
// ): NewVaultDeployed {
//   let newVaultDeployedEvent = changetype<NewVaultDeployed>(newMockEvent())

//   newVaultDeployedEvent.parameters = new Array()

//   newVaultDeployedEvent.parameters.push(
//     new ethereum.EventParam("deployer", ethereum.Value.fromAddress(deployer))
//   )
//   newVaultDeployedEvent.parameters.push(
//     new ethereum.EventParam("fundOwner", ethereum.Value.fromAddress(fundOwner))
//   )
//   newVaultDeployedEvent.parameters.push(
//     new ethereum.EventParam("proxy", ethereum.Value.fromAddress(proxy))
//   )
//   newVaultDeployedEvent.parameters.push(
//     new ethereum.EventParam(
//       "comptroller",
//       ethereum.Value.fromAddress(comptroller)
//     )
//   )
//   newVaultDeployedEvent.parameters.push(
//     new ethereum.EventParam(
//       "vaultImplementation",
//       ethereum.Value.fromAddress(vaultImplementation)
//     )
//   )

//   return newVaultDeployedEvent
// }
