import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { ExternalAdapterPairAdded } from "../generated/schema"
import { ExternalAdapterPairAdded as ExternalAdapterPairAddedEvent } from "../generated/Contract/Contract"
import { handleExternalAdapterPairAdded } from "../src/contract"
import { createExternalAdapterPairAddedEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let _externalContract = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let _adapterContract = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newExternalAdapterPairAddedEvent = createExternalAdapterPairAddedEvent(
      _externalContract,
      _adapterContract
    )
    handleExternalAdapterPairAdded(newExternalAdapterPairAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ExternalAdapterPairAdded created and stored", () => {
    assert.entityCount("ExternalAdapterPairAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ExternalAdapterPairAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_externalContract",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ExternalAdapterPairAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_adapterContract",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
