/** Input required to create a moderator link. */
export interface CreateModeratorInput {
  moderatorName: string;
  linkTime: number;
  link: string;
}

/** Serializes moderator creation input to the wire format expected by Tipply. */
export function toCreateModeratorWire(input: CreateModeratorInput): Record<string, unknown> {
  return {
    moderator_name: input.moderatorName,
    link_time: input.linkTime,
    link: input.link,
  };
}
