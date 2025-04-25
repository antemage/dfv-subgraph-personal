import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';

export function generateId(event: ethereum.Event): string {
  return event.transaction.hash.toHex() + '/' + event.logIndex.toString();
}

export function getFundDetailsId(fundManager: Bytes, vaultProxy: Bytes): string {
  return fundManager.toHexString() + vaultProxy.toHexString();
}

export function getInvestorId(buyer: Bytes, vaultProxy: Bytes): string {
  return buyer.toHexString() + vaultProxy.toHexString();
}

export function getInvestorFundId(buyer: Bytes): string {
  return buyer.toHexString();
}

export function getFundTokenAllocationId(vaultProxy: Bytes, assetAddress: Bytes): string {
  return vaultProxy.toHexString() + assetAddress.toHexString();
}

export function getFundFeesId(fundManager: Bytes, vaultProxy: Bytes, perfFee: BigInt): string {
  return fundManager.toHexString() + vaultProxy.toHexString() + perfFee.toHex();
}

export function getFundFeeSharesId(vaultProxy: Bytes, perfFee: BigInt, sharesQuantity: BigInt): string {
  return vaultProxy.toHexString() + perfFee.toHex() + sharesQuantity.toHex();
}

export function getInvestorReturnsId(vaultProxy: Bytes, investor: Bytes, perfFee: BigInt, mFee: BigInt): string {
  return vaultProxy.toHexString() + investor.toHexString()+ perfFee.toHex() + mFee.toHex();
}

export function getIntegrationDataId(fundManager: Bytes, vaultProxy: Bytes, selector: Bytes): string {
  return fundManager.toHexString() + vaultProxy.toHexString() + selector.toHexString();
}

export function getFeesEarnedId(fundManager: Bytes, vaultProxy: Bytes): string {
  return fundManager.toHexString() + vaultProxy.toHexString();
}