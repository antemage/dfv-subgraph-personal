import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigDecimal, Bytes } from "@graphprotocol/graph-ts";
import { handleNewAssetAdded } from "../src/vault";
import { createNewAssetAdded } from "./vault-utils";
import { Vault as VaultTemplate } from "../generated/schema";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  let asset = Address.fromString("0x0000000000000000000000000000000000000005");
  // asset.push(Address.fromString("0x0000000000000000000000000000000000000005"));
  // asset.push(Address.fromString("0x0000000000000000000000000000000000000006"));

  // const vaultId = Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a"); 
  // const vaultTotalAmount = Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a"); 
  // const vault = {
  //   id: Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a"),
  //   totalAmount: BigDecimal.fromString("0"),
  //   owner: Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a"),
  //   proxy: Address.fromString("0x000000000000000000000000000000000000000C"),
  //   comptroller: Address.fromString("0x000000000000000000000000000000000000000D"),
  //   implementation: Address.fromString("0x0000000000000000000000000000000000000003"),
  //   tokenProxy: Address.fromString("0x0000000000000000000000000000000000000004")
  // };

  beforeAll(() => {
    let prevDeployer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let deployer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newDeployerSetEvent = createNewAssetAdded(Address.fromString("0x0000000000000000000000000000000000000005"))

    const vaultKey = Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a");

    const vaultInstance = new VaultTemplate(vaultKey.toHexString());

    vaultInstance.totalAmount = BigDecimal.fromString("0");
    vaultInstance.owner = Address.fromString("0xa16081f360e3847006db660bae1c6d1b2e17ec2a"); 
    vaultInstance.proxy = Address.fromString("0x000000000000000000000000000000000000000C");
    vaultInstance.comptroller = Address.fromString("0x000000000000000000000000000000000000000D");
    vaultInstance.implementation = Address.fromString("0x0000000000000000000000000000000000000003");
    vaultInstance.tokenProxy = Address.fromString("0x0000000000000000000000000000000000000004");
    vaultInstance.assets = [];
    vaultInstance.save();

    handleNewAssetAdded(newDeployerSetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Vault stores assets field", () => {
    assert.entityCount("Vault", 1)

    const vaultInstance = VaultTemplate.load("0xa16081f360e3847006db660bae1c6d1b2e17ec2a");

    let addedAsset: Bytes;
    if (vaultInstance != null) {
      addedAsset = vaultInstance.assets[0];
    }

    assert.stringEquals(addedAsset.toHexString(), "0x0000000000000000000000000000000000000005");


    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
