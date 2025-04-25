import { Counter } from '../../generated/schema';
import { Address } from '@graphprotocol/graph-ts';

export function getCounter(id: string): i32 {
  let counter = Counter.load(id);
  if (counter == null) {
    counter = new Counter(id);
    counter.count = 0;
  }

  counter.count = counter.count + 1;
  counter.save();

  return counter.count;
}

export function getActivityCounter(): i32 {
  return getCounter('activities');
}

export function getVaultCounter(): i32 {
  return getCounter('vaults');
}
