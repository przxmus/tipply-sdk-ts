export interface CreateModeratorInput {
  moderatorName: string;
  linkTime: number;
  link: string;
}

export function toCreateModeratorWire(input: CreateModeratorInput): Record<string, unknown> {
  return {
    moderator_name: input.moderatorName,
    link_time: input.linkTime,
    link: input.link,
  };
}
