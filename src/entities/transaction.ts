import { ethereum } from '@graphprotocol/graph-ts';
import { Transaction } from '../../generated/schema';

export function transactionId(tx: ethereum.Transaction): string {
  return tx.hash.toHex();
}

export function getTransactionDetails(event: ethereum.Event): Transaction {
  let id = transactionId(event.transaction);
  let transaction = Transaction.load(id);
  if (transaction) {
    return transaction;
  }

  transaction = new Transaction(id);
  transaction.from = event.transaction.from.toHex();
  transaction.to = event.transaction.to ? event.transaction.to : null;
  transaction.value = event.transaction.value.toBigDecimal();
  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.gasPrice = event.transaction.gasPrice.toBigDecimal();
  transaction.input = event.transaction.input.toHex();
  transaction.save();

  return transaction;
}