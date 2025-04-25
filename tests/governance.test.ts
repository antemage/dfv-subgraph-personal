import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt } from "@graphprotocol/graph-ts"
import { FeeBpsSet } from "../generated/schema"
import { FeeBpsSet as FeeBpsSetEvent } from "../generated/Governance/Governance"
import { handleFeeBpsSet } from "../src/governance"
import { createFeeBpsSetEvent } from "./governance-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let aumFeeBps = BigInt.fromI32(234)
    let perfFeeBps = BigInt.fromI32(234)
    let newFeeBpsSetEvent = createFeeBpsSetEvent(aumFeeBps, perfFeeBps)
    handleFeeBpsSet(newFeeBpsSetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FeeBpsSet created and stored", () => {
    assert.entityCount("FeeBpsSet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FeeBpsSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "aumFeeBps",
      "234"
    )
    assert.fieldEquals(
      "FeeBpsSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "perfFeeBps",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
