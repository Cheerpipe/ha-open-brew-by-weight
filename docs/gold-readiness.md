# Home Assistant Gold-readiness evidence

This custom integration is **Gold-ready**, not Gold-certified. Official tier
assignment requires later inclusion in Home Assistant Core and review there.

| Rule area | Status and evidence |
| --- | --- |
| UI configuration and uniqueness | Done: IP/host-only user flow, an access step only while the controller's Web UI login is on (device password exchanged once and never stored, or a code-matched Web UI pairing), stable MAC unique ID, duplicate abort, takeover confirmation, and config-flow tests |
| Runtime data and async I/O | Done: typed `ConfigEntry.runtime_data`, injected Home Assistant session, `DataUpdateCoordinator`, and no blocking I/O |
| Test before configure/setup | Done: identity/API checks in the flow; registered callback, correlated test, and first refresh before platforms |
| Unload and availability | Done: platform unload cancels bounded recovery and unregisters the receiver; transport failures mark entities unavailable and use one finite 5/10/20/40/60-second recovery sequence without periodic polling |
| Reauthentication | Done: while the controller's optional Web UI login is on, `INTEGRATION_AUTH_REQUIRED` raises `ConfigEntryAuthFailed`; `reauth_confirm` then reopens the same device-password or Web UI pairing step, verifies the same device, and replaces only the stored token |
| Reconfiguration | Done: current host/secret webhook ID, callback preview, same-device validation, candidate-first registration, correlated verification, rollback, and repair issue |
| Device and entities | Done: one device, stable unique IDs, entity-name semantics, translations, classes/units/icons, explicit enums, non-optimistic preset/Quick Settings controls, and a configuration-category restart button |
| Diagnostics | Done: host, integration token, callback URL/ID, and correlation data are excluded or redacted |
| Documentation | Done: installation, removal, entities, data updates, examples, limitations, migration, security, reconfigure, and troubleshooting |
| Tests and quality tools | Done: the Tests workflow runs pytest with module coverage ≥95%, Ruff, and strict mypy; the Validate workflow runs hassfest and HACS validation |
| Discovery | Done: the firmware's `_http._tcp` service carries an `obbw` identification TXT record and the manifest matches it; `async_step_zeroconf` probes the API, sets the stable device identity, and asks for confirmation before creating an entry |
| Discovery update info | Done: `_abort_if_unique_id_configured(updates={host})` refreshes the address of an existing entry when the same controller is rediscovered. While the Web UI login is on, identity needs a token, so discovery aborts for an address that is already configured; a controller found at a new address is matched after the access step, which also hands the new token to the existing entry |
| Dynamic devices | Exempt: one config entry always represents exactly one fixed controller |
| Stale devices | Exempt: the integration never creates nested or dynamically discovered devices |
| Actions/triggers/conditions | Done without custom services: restart is a standard translated `ButtonEntity`; the integration registers no custom actions, triggers, or conditions |
| Entity categories/default disable | Done: restart is categorized as configuration; shot, preset, and Quick Settings entities remain primary user-facing controls or values |
| Repairs | Done for the only extra user-actionable state: failure of both candidate callback verification and remote rollback |

Before a Core submission, translate this evidence into Core's then-current
`quality_scale.yaml` and re-run the official checklist. Do not copy this custom
claim as an official tier.
