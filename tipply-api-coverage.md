# Tipply API Coverage

Macierz pokrycia aktualnego TypeScript SDK względem `openapi.json`.

## Legenda
- `[x]` w kolumnie `SDK` oznacza, że operacja jest zaimplementowana w obecnym SDK.
- `[x]` w kolumnie `OpenAPI` oznacza, że operacja istnieje w `openapi.json`.
- `[ ]` oznacza brak po tej stronie.
- `Surface` pokazuje najkrótszą ścieżkę wywołania w kliencie.

## Podsumowanie
- Operacje w `openapi.json`: 101
- Operacje w SDK: 50
- Pokryte przez SDK i obecne w OpenAPI: 41
- Operacje tylko w OpenAPI: 60
- Operacje tylko w SDK, bez opisu w OpenAPI: 9

## Uwagi
- Publiczny klient pod `tipply.pl/api` jest zaimplementowany w SDK, ale większość jego operacji nie występuje w `openapi.json`.
- Surface `user` obejmuje pełny odczyt profilu oraz lekki probe pending profile przez `GET /user/profile?pending=true`.
- Buildery `tips` i `withdrawals` dodają obsługę query nad udokumentowanymi endpointami odczytu.

## user

- [x] [x] GET /user — client.me.get() — auth; current user
- [ ] [x] DELETE /user — — — not implemented in the SDK yet
- [ ] [x] PATCH /user/{provider}/disconnect — — — not implemented in the SDK yet
- [ ] [x] PATCH /user/2fa/email/disable — — — not implemented in the SDK yet
- [ ] [x] PATCH /user/2fa/email/enable/{code} — — — not implemented in the SDK yet
- [ ] [x] PATCH /user/2fa/email/send-code — — — not implemented in the SDK yet
- [ ] [x] PATCH /user/2fa/google/connect — — — not implemented in the SDK yet
- [ ] [x] PATCH /user/2fa/google/disable — — — not implemented in the SDK yet
- [ ] [x] PATCH /user/2fa/google/enable/{code} — — — not implemented in the SDK yet
- [x] [x] GET /user/accounts — client.withdrawals.accounts.list() — auth; withdrawal accounts
- [x] [x] GET /user/configuration — client.settings.list() — auth; full settings list
- [ ] [x] POST /user/configuration/{key} — — — not implemented in the SDK yet
- [ ] [x] PUT /user/configuration/{key} — — — not implemented in the SDK yet
- [x] [ ] PUT /user/configuration/COUNTER_TO_END_LIVE — client.settings.countdown.update(...) — auth; countdown settings
- [ ] [x] PUT /user/configuration/global/{key} — — — not implemented in the SDK yet
- [x] [x] GET /user/configuration/global/forbidden_words — client.settings.forbiddenWords.get() — auth; global settings read
- [x] [x] GET /user/configuration/global/profanity_filter — client.settings.profanityFilter.get() — auth; global settings read
- [x] [ ] PUT /user/configuration/TIP_ALERT — client.settings.tipAlerts.update(...) — auth; tip alerts settings
- [x] [x] PATCH /user/configuration/toggle-alerts — client.settings.alerts.toggle(...) — auth; body { disabled }
- [x] [x] PATCH /user/configuration/toggle-alerts-sound — client.settings.alertSound.toggle(...) — auth; body { disabled }
- [ ] [x] POST /user/connect-external-tips-source — — — not implemented in the SDK yet
- [ ] [x] POST /user/countdown/time — — — not implemented in the SDK yet
- [ ] [x] POST /user/disconnect-external-tips-source — — — not implemented in the SDK yet
- [ ] [x] PUT /user/disconnect-paypal-email — — — not implemented in the SDK yet
- [ ] [x] GET /user/donators — — — not implemented in the SDK yet
- [ ] [x] POST /user/donators — — — not implemented in the SDK yet
- [ ] [x] POST /user/donators/remove — — — not implemented in the SDK yet
- [x] [x] GET /user/goals — client.goals.list() — auth; goals list
- [x] [x] POST /user/goals — client.goals.create(...) — auth; goal create
- [x] [x] PATCH /user/goals/{goal_id} — client.goals.id(goalId).update(...) — auth; goal update
- [ ] [x] DELETE /user/goals/{goal_id} — — — not implemented in the SDK yet
- [x] [x] PATCH /user/goals/{goal_id}/reset — client.goals.id(goalId).reset() — auth; goal reset
- [ ] [x] GET /user/invoices — — — not implemented in the SDK yet
- [ ] [x] GET /user/kick/statuscheck — — — not implemented in the SDK yet
- [ ] [x] POST /user/kick/subscribe — — — not implemented in the SDK yet
- [ ] [x] POST /user/kick/unsubscribe — — — not implemented in the SDK yet
- [x] [ ] GET /user/media — client.media.list() — auth; media list
- [x] [x] GET /user/media/usage — client.media.usage.get() — auth; media usage
- [ ] [x] POST /user/new-bank-transfer-validation-request — — — not implemented in the SDK yet
- [x] [x] GET /user/notifications — client.dashboard.notifications.list() — auth; dashboard notifications
- [x] [x] GET /user/payment-methods — client.paymentMethods.list() — auth; payment methods list
- [x] [x] POST /user/payment-methods/{payment_method} — client.paymentMethods.method(key).update(...) — auth; update payment method
- [x] [x] GET /user/points — client.dashboard.points.get() — auth; dashboard points
- [x] [x] GET /user/profile — client.profile.get(); client.profile.pendingChanges.check() — auth; main profile read + pending probe (?pending=true)
- [ ] [x] PATCH /user/profile/{field} — — — not implemented in the SDK yet
- [ ] [x] DELETE /user/profile/{field} — — — not implemented in the SDK yet
- [x] [x] PATCH /user/profile/page_settings — client.profile.page.updateSettings(...) — auth; profile page settings update
- [ ] [x] POST /user/profile/sync_google_avatar — — — not implemented in the SDK yet
- [ ] [x] PUT /user/refresh-paypal-email — — — not implemented in the SDK yet
- [x] [x] GET /user/reports — client.reports.list() — auth; reports list
- [ ] [x] POST /user/set-new-statue-accepted — — — not implemented in the SDK yet
- [x] [x] GET /user/statistics/income — client.dashboard.stats.income.get() — auth; income stats
- [x] [x] GET /user/statistics/tips — client.dashboard.stats.tips.get() — auth; tip stats
- [x] [x] GET /user/templates — client.templates.list() — auth; templates list
- [ ] [x] POST /user/templates/{template_id} — — — not implemented in the SDK yet
- [x] [x] GET /user/tips — client.dashboard.tips.recent.list(); client.tips.list().get() — auth; recent tips uses limit=12, fluent list supports limit/offset/filter/search
- [x] [x] GET /user/tipsmoderation — client.tips.moderation.listQueue() — auth; moderation queue
- [ ] [x] POST /user/tipsmoderation/{tip_id}/approve — — — not implemented in the SDK yet
- [ ] [x] POST /user/tipsmoderation/{tip_id}/reject — — — not implemented in the SDK yet
- [ ] [x] POST /user/tipsmoderation/{tip_id}/restore — — — not implemented in the SDK yet
- [x] [x] GET /user/tipsmoderation/basket — client.tips.moderation.listBasket() — auth; moderation basket
- [x] [x] GET /user/tipspending — client.tips.pending.list() — auth; pending tips
- [ ] [x] POST /user/toggle-color-theme — — — not implemented in the SDK yet
- [x] [x] POST /user/toggle-message-audio — client.tips.audio.toggle() — auth; toggle audio
- [x] [x] POST /user/toggle-moderator — client.moderators.mode.toggle() — auth; toggle moderator mode
- [ ] [x] GET /user/twitch/statuscheck — — — not implemented in the SDK yet
- [ ] [x] POST /user/twitch/subscribe — — — not implemented in the SDK yet
- [ ] [x] POST /user/twitch/unsubscribe — — — not implemented in the SDK yet
- [ ] [x] GET /user/unset-redirect-missing-form — — — not implemented in the SDK yet
- [x] [x] GET /user/voting — client.goals.voting.get() — auth; voting configuration
- [ ] [x] PUT /user/voting — — — not implemented in the SDK yet
- [x] [x] GET /user/withdrawals — client.withdrawals.list().get() — auth; query status[], limit, offset
- [x] [x] GET /user/withdrawals/latest — client.withdrawals.latest.list() — auth; latest withdrawals

## public

- [x] [x] GET /public/profile/{link}/social-media — client.profile.public(slug).socialLinks.list() — public via proxy; social links

## announcements

- [x] [x] GET /announcements — client.dashboard.announcements.list() — auth; dashboard announcements
- [ ] [x] PATCH /announcements/read — — — not implemented in the SDK yet

## extraannouncements

- [x] [x] GET /extraannouncements — client.dashboard.announcements.listExtra() — auth; extra dashboard announcements
- [ ] [x] PATCH /extraannouncements/read — — — not implemented in the SDK yet

## payment-methods-configuration

- [x] [x] GET /payment-methods-configuration — client.paymentMethods.configuration.get() — auth; payment methods config

## moderators

- [x] [x] GET /moderators — client.moderators.list() — auth; moderators list
- [x] [x] POST /moderators — client.moderators.create(...) — auth; moderator create
- [ ] [x] PATCH /moderators/{moderator_id} — — — not implemented in the SDK yet
- [x] [x] DELETE /moderators/{moderator_id} — client.moderators.id(id).remove() — auth; moderator delete

## media

- [ ] [x] DELETE /media — — — not implemented in the SDK yet

## medium

- [ ] [x] POST /medium/{id} — — — not implemented in the SDK yet
- [x] [x] GET /medium/{id}/formats — client.media.id(id).formats.get() — auth; media formats

## templates

- [x] [x] PUT /templates/{template_id} — client.templates.id(templateId).replace(...) — auth; replace payload
- [ ] [x] DELETE /templates/{template_id} — — — not implemented in the SDK yet
- [x] [ ] GET /templates/GOAL_VOTING/{userId} — client.public.user(userId).voting.templates.list() — public client only; not present in openapi.json
- [x] [ ] GET /templates/TIPS_GOAL/{userId} — client.public.user(userId).goals.templates.list() — public client only; not present in openapi.json

## withdrawal-methods-configuration

- [x] [x] GET /withdrawal-methods-configuration — client.withdrawals.methods.configuration.get() — auth; withdrawal methods config

## withdrawals

- [ ] [x] POST /withdrawals — — — not implemented in the SDK yet

## notifications

- [ ] [x] PATCH /notifications/{notification_id}/read — — — not implemented in the SDK yet

## configuration

- [x] [ ] GET /configuration/GOAL_VOTING/{userId} — client.public.user(userId).voting.configuration.get() — public client only; not present in openapi.json
- [x] [ ] GET /configuration/TIPS_GOAL/{userId} — client.public.user(userId).goals.configuration.get() — public client only; not present in openapi.json

## widget

- [x] [ ] GET /widget/goal/{goalId}/{userId} — client.public.user(userId).goals.id(goalId).widget.get() — public client only; not present in openapi.json

## widgetmessage

- [x] [ ] GET /widgetmessage/{userId} — client.public.user(userId).widgetMessage.get() — public client only; not present in openapi.json

## commissions

- [ ] [x] GET /commissions — — — not implemented in the SDK yet

## moderation

- [ ] [x] GET /moderation/{id} — — — not implemented in the SDK yet

## moderationbasket

- [ ] [x] GET /moderationbasket/{id} — — — not implemented in the SDK yet

## moderationpanel

- [ ] [x] POST /moderationpanel/{id}/panelapprove — — — not implemented in the SDK yet
- [ ] [x] POST /moderationpanel/{id}/panelreject — — — not implemented in the SDK yet
- [ ] [x] POST /moderationpanel/{id}/panelrestore — — — not implemented in the SDK yet

## moderatordata

- [ ] [x] GET /moderatordata/{moderator_id} — — — not implemented in the SDK yet

## test-tip

- [ ] [x] POST /test-tip — — — not implemented in the SDK yet

## text-to-speech

- [ ] [x] GET /text-to-speech/test/google/female — — — not implemented in the SDK yet
- [ ] [x] GET /text-to-speech/test/google/male — — — not implemented in the SDK yet

## tip

- [ ] [x] DELETE /tip/{tip_id} — — — not implemented in the SDK yet
- [ ] [x] POST /tip/{tip_id}/resend — — — not implemented in the SDK yet

## validators

- [ ] [x] PATCH /validators/{validator} — — — not implemented in the SDK yet
