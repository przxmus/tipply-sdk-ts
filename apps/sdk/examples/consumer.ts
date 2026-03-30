import { createTipplyClient, type UserConfiguration } from "../src";

const client = createTipplyClient({
  session: {
    getAuthCookie: async () => process.env.TIPPLY_AUTH_COOKIE,
  },
});

async function readConfigurationTypes(): Promise<void> {
  const configurations = await client.settings.list();

  for (const configuration of configurations) {
    renderConfiguration(configuration);
  }
}

function renderConfiguration(configuration: UserConfiguration): void {
  switch (configuration.type) {
    case "COUNTER_TO_END_LIVE":
      if ("extraTime" in configuration.config) {
        console.log(configuration.config.extraTime);
      }
      break;
    case "GLOBAL":
      if ("profanityFilterEnabled" in configuration.config) {
        console.log(configuration.config.profanityFilterEnabled);
      }
      break;
    case "TIP_ALERT":
      if ("voiceMessages" in configuration.config) {
        const config = configuration.config as { voiceMessages: { enabled: boolean } };
        console.log(config.voiceMessages.enabled);
      }
      break;
    default:
      console.log(configuration.type);
  }
}

void readConfigurationTypes();

client.paymentMethods.method("cashbill_blik").update({
  enabled: false,
});
