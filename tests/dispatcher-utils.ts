import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  DeployerSet,
  NewVaultDeployed
} from "../generated/Dispatcher/Dispatcher"

export function createDeployerSetEvent(
  prevDeployer: Address,
  deployer: Address
): DeployerSet {
  let deployerSetEvent = changetype<DeployerSet>(newMockEvent())

  deployerSetEvent.parameters = new Array()

  deployerSetEvent.parameters.push(
    new ethereum.EventParam(
      "prevDeployer",
      ethereum.Value.fromAddress(prevDeployer)
    )
  )
  deployerSetEvent.parameters.push(
    new ethereum.EventParam("deployer", ethereum.Value.fromAddress(deployer))
  )

  return deployerSetEvent
}

export function createNewVaultDeployedEvent(
  deployer: Address,
  fundOwner: Address,
  proxy: Address,
  comptroller: Address,
  vaultImplementation: Address
): NewVaultDeployed {
  let newVaultDeployedEvent = changetype<NewVaultDeployed>(newMockEvent())

  newVaultDeployedEvent.parameters = new Array()

  newVaultDeployedEvent.parameters.push(
    new ethereum.EventParam("deployer", ethereum.Value.fromAddress(deployer))
  )
  newVaultDeployedEvent.parameters.push(
    new ethereum.EventParam("fundOwner", ethereum.Value.fromAddress(fundOwner))
  )
  newVaultDeployedEvent.parameters.push(
    new ethereum.EventParam("proxy", ethereum.Value.fromAddress(proxy))
  )
  newVaultDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "comptroller",
      ethereum.Value.fromAddress(comptroller)
    )
  )
  newVaultDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "vaultImplementation",
      ethereum.Value.fromAddress(vaultImplementation)
    )
  )

  return newVaultDeployedEvent
}
