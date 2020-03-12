import { Repository } from "./Repository";
import {
  ICheckoutModel,
  IJobsModel,
  ILocalRepository,
  LocalStorageItems,
} from "./types";

export class LocalRepository extends Repository implements ILocalRepository {
  getCheckoutToken(): string | null {
    return this.retrieveItem(LocalStorageItems.CHECKOUT_TOKEN);
  }
  setCheckoutToken(token: string | null): void {
    this.saveItem(LocalStorageItems.CHECKOUT_TOKEN, token);
  }
  getCheckout(): ICheckoutModel | null {
    return this.retrieveObject(LocalStorageItems.CHECKOUT);
  }
  setCheckout(checkout: ICheckoutModel | null): void {
    this.saveObject(LocalStorageItems.CHECKOUT, checkout);
  }
  getJobs(): IJobsModel | null {
    return this.retrieveObject(LocalStorageItems.JOB_QUEUE_CHECKOUT);
  }
  setJobs(jobs: IJobsModel | null): void {
    return this.saveObject(LocalStorageItems.JOB_QUEUE_CHECKOUT, jobs);
  }
}
