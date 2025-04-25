import { Asset } from '../../generated/schema';
import { Address } from '@graphprotocol/graph-ts';
import { ERC20 } from "../../generated/templates/ComptrollerLogic/ERC20"

export function getOrCreateAsset(address: Address): Asset {
    let asset = Asset.load(address.toHex());
    if (asset) {
      return asset;
    }
    let contract = ERC20.bind(address);
  
    asset = new Asset(address.toHex());
    asset.name = (contract.try_name().reverted) ? "0":contract.try_name().value;
    asset.symbol = (contract.try_symbol().reverted) ? "0":contract.try_symbol().value;
    asset.decimals = (contract.try_decimals().reverted) ? 0 :contract.try_decimals().value;
    asset.type = 'PRIMITIVE';
    asset.save();
  
    return asset;
  }