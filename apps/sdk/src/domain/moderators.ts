/** Input payload accepted by `client.moderators.create()`. */
export interface CreateModeratorInput {
  moderatorName: string;
  linkTime: number;
  link: string;
}

/**
 * Serializes a moderator creation payload into Tipply's wire format.
 *
 * @param input - The moderator input to serialize.
 * @returns A wire-format object ready to send to Tipply.
 */
export function toCreateModeratorWire(input: CreateModeratorInput): Record<string, unknown> {
  return {
    moderator_name: input.moderatorName,
    link_time: input.linkTime,
    link: input.link,
  };
}
