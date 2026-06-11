---
name: Stripe MCP metadata bracket notation
description: How to set metadata via the Stripe MCP stripeApiExecute tool (the only form that works)
---

When updating Stripe object metadata through the Stripe MCP `mcpStripe_stripeApiExecute`
tool, metadata keys MUST be passed as flat bracket-notation parameters, e.g.
`{ "metadata[neuronotes_tier]": "eppp" }`.

Both of these FAIL with `Invalid value for 'metadata'. Metadata must be a single object`:
- nested object: `{ metadata: { neuronotes_tier: "eppp" } }`
- dot notation: `{ "metadata.neuronotes_tier": "eppp" }`

**Why:** the MCP wrapper flattens parameters before sending to Stripe's
form-encoded API; only `field[key]` bracket form survives the flattening as a
proper nested metadata object.

**How to apply:** any product/price/customer update via `stripeApiExecute` (e.g.
`PostProductsId`, `PostPricesPrice`). Find the right operation id with
`mcpStripe_stripeApiSearch` first — product update is `PostProductsId`, not
`PostProductsProduct`.
