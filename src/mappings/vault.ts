import {  AssetDeposited, 
          AssetTransferred, 
          DepositAssetAdded,
          DepositAssetAddedBulk, 
          DepositAssetRemoved, 
          DepositAssetRemovedBulk, 
          MaticReceived, 
          OwnerSet, 
          SharesBurned, 
          SharesMinted, 
          VaultLibrarySet } from "../../generated/templates/Vault/Vault";
import { getOrCreateAsset } from "../entities/asset";
import { getOrCreateFund } from "../entities/fund";
import { arrayUnique } from "../utils/helper";

export function handleOwnerSet(event: OwnerSet): void {

}

export function handleNewAssetAdded(event: DepositAssetAdded): void {
  getOrCreateAsset(event.params.depositAsset);
}

export function handleMaticReceived(event: MaticReceived): void {

}

export function handleSharesBurned(event: SharesBurned): void {

}

export function handleSharesMinted(event: SharesMinted): void {

}

export function handleAssetDeposited(event: AssetDeposited): void {

}

export function handleAssetTransferred(event: AssetTransferred): void {

}

export function handleDepositAssetAddedBulk(event: DepositAssetAddedBulk): void {

  const newAssets = event.params.depositAsset;
  const vaultInstance = getOrCreateFund(event.address.toHexString());
  //log.info("vault {} ", [event.address.toHexString()]);
  if (vaultInstance != null) {
    for (let i = 0; i < newAssets.length; i++) {
      vaultInstance.assets = arrayUnique<string>(vaultInstance.assets.concat([getOrCreateAsset(newAssets[i]).id]));
      vaultInstance.save();
    }
      
  }
  
}

export function handleDepositAssetRemoved(event: DepositAssetRemoved): void {

}

export function handleDepositAssetRemovedBulk(event: DepositAssetRemovedBulk): void {

}

export function handleVaultLibrarySet(event: VaultLibrarySet): void {

}

