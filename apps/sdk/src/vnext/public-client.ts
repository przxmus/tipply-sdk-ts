import type { TipplyClientOptions } from "../core/types";
import { TipplyTransport } from "../core/transport";
import { PublicRootResource } from "./resources/public";

export class TipplyPublicClient {
  readonly public: PublicRootResource;

  private readonly transport: TipplyTransport;

  constructor(options: TipplyClientOptions = {}) {
    this.transport = new TipplyTransport(options);
    this.public = new PublicRootResource(this.transport);
  }

  user(userId: string) {
    return this.public.user(userId);
  }
}
