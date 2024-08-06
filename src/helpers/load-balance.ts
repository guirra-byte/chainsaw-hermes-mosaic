import { Worker } from "node:worker_threads";

export async function loadBalance(index: number, array: Worker[]) {
  return function () {
    if (index >= array.length) index = 0;
    return array[index++];
  };
}
