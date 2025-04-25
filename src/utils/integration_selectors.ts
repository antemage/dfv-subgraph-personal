export let addLiquiditySelector = '0xd39698ec';
export let addLiquidityType = 'ADD_LIQUIDITY';

export let removeLiquiditySelector = '0x5c8ea02b';
export let removeLiquidityType = 'REMOVE_LIQUIDITY';

export let swapSelector = '0x4d67ba94';
export let swapType = 'SWAP';

export let aaveV2LendSelector = '0xd119f7c0';
export let aaveV2LendType = 'AAVE_V2_LEND';

export let aaveV3LendSelector = '0xfe4d7594';
export let aaveV3LendType = 'AAVE_V3_LEND';

export let aaveV2WithdrawSelector = '0xfb0bbfb5';
export let aaveV2WithdrawType = 'AAVE_V2_WITHDRAW';

export let aaveV3WithdrawSelector = '0xfb0bbfb5';
export let aaveV3WithdrawType = 'AAVE_V3_WITHDRAW';

export let beefyDepositSelector = '0xa6094933';
export let beefyDepositType = 'BEEFY_DEPOSIT';

export let beefyWithdrawSelector = '0x84bd8f2f';
export let beefyWithdrawType = 'BEEFY_WITHDRAW';

export function convertSelectorToType(selector: string): string {
    if (selector == addLiquiditySelector) {
      return addLiquidityType;
    }
  
    if (selector == removeLiquiditySelector) {
      return removeLiquidityType;
    }
  
    if (selector == swapSelector) {
      return swapType;
    }

    if (selector == aaveV2LendSelector) {
        return aaveV3LendType;
    }

    if (selector == aaveV3LendSelector) {
        return aaveV3LendType;
    }

    if (selector == aaveV2WithdrawSelector) {
        return aaveV2WithdrawType;
    }
    if (selector == aaveV3WithdrawSelector) {
        return aaveV3WithdrawType;
    }
    if (selector == beefyDepositSelector) {
        return beefyDepositType;
    }
    if (selector == beefyWithdrawSelector) {
        return beefyWithdrawType;
    }
    return 'UNKNOWN';
  }