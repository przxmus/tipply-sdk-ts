import { describe, expect, test } from "bun:test";

import { asUserId } from "../../src";
import { parseTipAlertDonation } from "../../src/domain/alerts-schemas";
import { parseTipAlertsWidgetUrl, PublicTipAlertsListener } from "../../src/realtime/tip-alerts";

const rawDonationPayload = {
  receiver_id: "ec645d33-15b7-42c4-bc85-82da124b83bf",
  nickname: "Test",
  email: "tip-test@tipply.pl",
  message: "Lorem ipsum dolor sit amet",
  amount: 1000,
  commission: 0,
  test: true,
  resent: false,
  source: "internal",
  payment_id: null,
  audio_url: null,
  goal_id: null,
  moderated_at: null,
  id: "a9572849-01f4-4472-89e9-757d45dab0e0",
  created_at: "2026-03-30T17:08:33+02:00",
  goal_title: null,
  tts_nickname_google_female: null,
  tts_message_google_female: "/ttscache/54/e5/54e51abc3f1b2a58e3ea00edc1617baa.mp3",
  tts_amount_google_female: null,
};

class MockSocket {
  connected = false;
  connectCalls = 0;
  disconnectCalls = 0;
  private readonly listeners = new Map<string, Set<(...args: any[]) => void>>();

  on(event: string, listener: (...args: any[]) => void): this {
    const existing = this.listeners.get(event) ?? new Set();
    existing.add(listener);
    this.listeners.set(event, existing);
    return this;
  }

  off(event: string, listener?: (...args: any[]) => void): this {
    if (!listener) {
      this.listeners.delete(event);
      return this;
    }

    const existing = this.listeners.get(event);
    existing?.delete(listener);

    if (existing?.size === 0) {
      this.listeners.delete(event);
    }

    return this;
  }

  connect(): this {
    this.connectCalls += 1;
    return this;
  }

  disconnect(): this {
    this.disconnectCalls += 1;
    this.connected = false;
    return this;
  }

  emit(event: string, ...args: any[]): void {
    if (event === "connect") {
      this.connected = true;
    }

    if (event === "disconnect") {
      this.connected = false;
    }

    for (const listener of this.listeners.get(event) ?? []) {
      listener(...args);
    }
  }
}

function createListener(socket: MockSocket) {
  return new PublicTipAlertsListener(
    asUserId("user-123"),
    "https://alert-ws.tipply.pl",
    undefined,
    () => socket,
  );
}

describe("tip alert donation parser", () => {
  test("maps the widget payload to the public SDK shape", () => {
    const donation = parseTipAlertDonation(rawDonationPayload);

    expect(donation).toMatchObject({
      receiverId: rawDonationPayload.receiver_id,
      nickname: rawDonationPayload.nickname,
      email: rawDonationPayload.email,
      message: rawDonationPayload.message,
      amount: rawDonationPayload.amount,
      commission: rawDonationPayload.commission,
      test: rawDonationPayload.test,
      resent: rawDonationPayload.resent,
      source: rawDonationPayload.source,
      paymentId: null,
      audioUrl: null,
      goalId: null,
      moderatedAt: null,
      createdAt: rawDonationPayload.created_at,
      goalTitle: null,
      ttsNicknameGoogleFemale: null,
      ttsMessageGoogleFemale: rawDonationPayload.tts_message_google_female,
      ttsAmountGoogleFemale: null,
    });
  });

  test("preserves the raw payload for callers that need widget-level fields", () => {
    const donation = parseTipAlertDonation(rawDonationPayload);

    expect(donation.raw).toEqual(rawDonationPayload);
  });

  test("tolerates nullable optional fields", () => {
    const donation = parseTipAlertDonation({
      ...rawDonationPayload,
      payment_id: null,
      audio_url: null,
      goal_id: null,
      goal_title: null,
    });

    expect(donation.paymentId).toBeNull();
    expect(donation.audioUrl).toBeNull();
    expect(donation.goalId).toBeNull();
    expect(donation.goalTitle).toBeNull();
  });

  test("extracts the user id from a full widget URL", () => {
    const userId = parseTipAlertsWidgetUrl(
      "https://widgets.tipply.pl/TIP_ALERT/ec645d33-15b7-42c4-bc85-82da124b83bf",
    );

    expect(userId).toBe("ec645d33-15b7-42c4-bc85-82da124b83bf");
  });

  test("extracts the user id from a raw TIP_ALERT path", () => {
    const userId = parseTipAlertsWidgetUrl("/TIP_ALERT/ec645d33-15b7-42c4-bc85-82da124b83bf");

    expect(userId).toBe("ec645d33-15b7-42c4-bc85-82da124b83bf");
  });

  test("rejects non-TIP_ALERT widget URLs", () => {
    expect(() => parseTipAlertsWidgetUrl("https://widgets.tipply.pl/TIPS_GOAL/user-123")).toThrow(
      "Invalid TIP_ALERT widget URL",
    );
  });
});

describe("public tip alerts listener", () => {
  test("emits ready and resolves connect when the socket connects", async () => {
    const socket = new MockSocket();
    const listener = createListener(socket);
    let readyCalls = 0;

    listener.on("ready", () => {
      readyCalls += 1;
    });

    const connection = listener.connect();
    socket.emit("connect");
    await connection;

    expect(readyCalls).toBe(1);
    expect(listener.connected).toBe(true);
    expect(socket.connectCalls).toBe(1);
  });

  test("emits donation with normalized payload", async () => {
    const socket = new MockSocket();
    const listener = createListener(socket);
    const donations: unknown[] = [];

    listener.on("donation", (donation) => {
      donations.push(donation);
    });

    const connection = listener.connect();
    socket.emit("connect");
    await connection;
    socket.emit("alert", rawDonationPayload);

    expect(donations).toHaveLength(1);
    expect(donations[0]).toMatchObject({
      id: rawDonationPayload.id,
      receiverId: rawDonationPayload.receiver_id,
    });
  });

  test("emits disconnect with the provided reason", async () => {
    const socket = new MockSocket();
    const listener = createListener(socket);
    const reasons: string[] = [];

    listener.on("disconnect", (reason) => {
      reasons.push(reason);
    });

    const connection = listener.connect();
    socket.emit("connect");
    await connection;
    socket.emit("disconnect", "transport close");

    expect(reasons).toEqual(["transport close"]);
    expect(listener.connected).toBe(false);
  });

  test("emits error and rejects connect on connect_error", async () => {
    const socket = new MockSocket();
    const listener = createListener(socket);
    const errors: string[] = [];

    listener.on("error", (error) => {
      errors.push(error.message);
    });

    const connection = listener.connect();
    socket.emit("connect_error", new Error("boom"));

    await expect(connection).rejects.toThrow("boom");
    expect(errors).toEqual(["boom"]);
  });

  test("supports once semantics for listeners", async () => {
    const socket = new MockSocket();
    const listener = createListener(socket);
    let calls = 0;

    listener.once("donation", () => {
      calls += 1;
    });

    const connection = listener.connect();
    socket.emit("connect");
    await connection;
    socket.emit("alert", rawDonationPayload);
    socket.emit("alert", rawDonationPayload);

    expect(calls).toBe(1);
  });

  test("supports off for removing a specific listener", async () => {
    const socket = new MockSocket();
    const listener = createListener(socket);
    let calls = 0;

    const donationListener = () => {
      calls += 1;
    };

    listener.on("donation", donationListener);
    listener.off("donation", donationListener);

    const connection = listener.connect();
    socket.emit("connect");
    await connection;
    socket.emit("alert", rawDonationPayload);

    expect(calls).toBe(0);
  });

  test("supports removeAllListeners for a single event", async () => {
    const socket = new MockSocket();
    const listener = createListener(socket);
    let calls = 0;

    listener.on("donation", () => {
      calls += 1;
    });
    listener.on("error", () => {
      calls += 100;
    });
    listener.removeAllListeners("donation");

    const connection = listener.connect();
    socket.emit("connect");
    await connection;
    socket.emit("alert", rawDonationPayload);

    expect(calls).toBe(0);
  });

  test("destroy disconnects the socket and clears listeners", async () => {
    const socket = new MockSocket();
    const listener = createListener(socket);
    let calls = 0;

    listener.on("donation", () => {
      calls += 1;
    });

    const connection = listener.connect();
    socket.emit("connect");
    await connection;
    listener.destroy();
    socket.emit("alert", rawDonationPayload);

    expect(socket.disconnectCalls).toBe(1);
    expect(listener.connected).toBe(false);
    expect(calls).toBe(0);
  });
});
