declare module "bun:test" {
  export const describe: any;
  export const test: any;
  export const expect: any;
}

declare module "socket.io-client" {
  interface SocketIoClientLike {
    connected: boolean;
    on(event: string, listener: (...args: any[]) => void): this;
    off(event: string, listener?: (...args: any[]) => void): this;
    connect(): this;
    disconnect(): this;
  }

  export default function io(
    url: string,
    options?: {
      autoConnect?: boolean;
      reconnection?: boolean;
    },
  ): SocketIoClientLike;
}
