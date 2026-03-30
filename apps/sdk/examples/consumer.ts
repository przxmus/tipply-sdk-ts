import { TipplyClient, type UserConfigurationRecord } from "../src";

const client = new TipplyClient({
  getAuthCookie: async () => process.env.TIPPLY_AUTH_COOKIE,
});

async function readConfigurationTypes(): Promise<void> {
  const configurations = await client.configurations.list();

  for (const configuration of configurations) {
    renderConfiguration(configuration);
  }
}

function renderConfiguration(configuration: UserConfigurationRecord): void {
  switch (configuration.type) {
    case "COUNTER_TO_END_LIVE":
      console.log(configuration.config.extraTime);
      break;
    case "GLOBAL":
      console.log(configuration.config.profanity_filter_enabled);
      break;
    case "TIP_ALERT":
      console.log(configuration.config.voiceMessages.enable);
      break;
    default:
      console.log(configuration.type);
  }
}

void readConfigurationTypes();

client.paymentMethods.update("cashbill_blik", {
  enabled: false,
});
