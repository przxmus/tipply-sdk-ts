import { asGoalId, asUserId } from "../src";
import { createTipplyPublicClient } from "../src/public";

const userId = process.env.TIPPLY_USER_ID;
const goalId = process.env.TIPPLY_GOAL_ID;

if (!userId || !goalId) {
  throw new Error("Set TIPPLY_USER_ID and TIPPLY_GOAL_ID before running this example.");
}

const client = createTipplyPublicClient();
const user = client.user(asUserId(userId));

const [configuration, widget, fontsCss] = await Promise.all([
  user.goals.configuration.get(),
  user.goals.id(asGoalId(goalId)).widget.get(),
  user.templateFonts.get(),
]);

console.log(
  JSON.stringify(
    {
      goalName: configuration.goalName,
      goalValue: configuration.goalValue,
      widgetTitle: widget.config.title,
      widgetTarget: widget.config.target,
      collectedAmount: widget.stats.amount,
      fontsCssPreview: fontsCss.slice(0, 120),
    },
    null,
    2,
  ),
);
