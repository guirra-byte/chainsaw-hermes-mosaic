import { Worker } from "node:worker_threads";

export async function workersPool(
  array: Worker[],
  pathname: string,
  copies: number
) {
  for (let index = 0; index <= copies; index++) {
    array.push(new Worker(pathname));
  }
}
