# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.8.4] - 2024-10-22

-   Added capability for walletconnect to verify the explorer registered domains.

## [3.8.3] - 2024-08-07

-   Removed graphQL polling.

## [3.8.2] - 2024-07-19

-   Removed configurations to communicate with subgraph hosted-services.

## [3.8.1] - 2024-06-28

-   Added fine-tune to plug ENS graphql endpoints for use by the server with ISC. Previous endpoint act as fallback for dev/preview.
-   API stats set to use Chainstack graphql instead of hosted-services.

## [3.8.0] - 2024-04-03

-   Added support to the Sepolia testnet.
-   Removed the Goerli testnet.
-   Chore work done by removing a bunch of unused network definitions, (e.g. Arb Goerli)

## [3.7.1] - 2024-01-10

-   Footer links were updated.

## [3.7.0] - 2023-09-20

-   The Staking application got a new look and feel. Following the new brand colors.
-   We removed gas-based staking pool creation option in the staking app.
-   The rollups explorer was removed from this repository.

## [3.6.2] - 2023-08-14

-   Update the main GraphQL endpoints to be configurable (i.e. through environment variables).
-   Fix the static page generation (ISR) type definition.

## [3.6.1] - 2023-08-02

-   Removing support to Ledger wallet as a separate option. Users can still use ledger hardware wallet through WalletConnect as both use the same workflow through the Ledger live app.

## [3.6.0] - 2023-07-31

-   `Staking`
    -   The wallet was upgraded. There is a change for ledger connection workflow that involves using the ledger live app.
    -   Multiple library dependencies were upgraded.
-   `Rollups`
    -   We add a feedback message in the DApp detail view when there are no inputs to be displayed yet.
-   Several dependencies were upgraded.

## [3.5.2] - 2023-07-18

-   `Staking`
    -   Fix applied to bring the app navigation to its normal flow.

## [3.5.1] - 2023-07-12

-   `Staking`
    -   New Cartesi logo added.
    -   Test startup on CI optimized.
-   `Rollups`
    -   New Cartesi logo added.
    -   Rollups v0.8.2 removed.
    -   Image generation optimized by replacing QEMU with Depot.

## [3.5.0] - 2023-06-24

-   `Staking`
    -   Increased code coverage to multiple components
    -   Fix the alignment between the header text and arrow icon when sorting the staking pool table.
    -   We are switching to feed indexed data from Chainstack and moving away from AWS.
-   `Rollups`
    -   Increased code coverage to multiple components
    -   The DApp details page is all set for rollups `v0.9.x`.
    -   Improvements done for docker image generation for rollups. That includes linux/arm64 architecture besides the linux/amd64.

## [3.4.0] - 2023-06-05

-   `Staking`
    -   Code changes to start consuming staking pool performance information from Subgraph.
    -   Added configuration related to Sepolia network.
-   `rollups`
    -   Added changes to support local DApp development.
    -   Added docker file to generate explorer-rollups images and documentation with more details.
    -   Applied fixes and also increased test coverage.

## [3.3.0] - 2023-04-25

-   Added JSON view support for DApp detail view on Rollups.
-   Maintenance applied to shared code and internal dependencies, e.g. update version.
-   Applied fix to DApp address search on rollups main page.
-   Added support to listing DApp of different versions.
-   Applied a fix on how we deal logically with a zero value in the new React version.
-   Removed the old google analytics called universal analytics.

## [3.2.2] - 2023-03-01

-   `Staking`
    -   We fixed the alignment for the notification content.

## [3.2.1] - 2023-02-23

-   `Staking`
    -   A fix was applied to the behavior when doing a full unstake. We only pass down the total amount of staked-shares the user requesting has instead of doing calculations.

## [3.2.0] - 2023-02-16

-   `Staking`
    -   Changes applied to enhance our scores on SEO, Accessibility and best practices based on lighthouse report for desktop.
    -   A fix was applied to keep the pool-info tab selected when the user accesses the staking pool users page.
    -   A fix was applied to the staking pool management screen. Now managers will see correctly the nodes retired by the pool and not the private nodes managers themselves had retired if any.
    -   Maintenance work done;
        -   Feature flags for staking pool users and commission pages were retired.
        -   Upgrade dependencies with special attention to the Luxon update that solves a High severity vulnerability.

## [3.1.0] - 2023-01-25

-   Added support to PoS v2 for pool manager to be able to update their pools. That is only a deployment and rollout will be coming later. [Feature Flagged]
-   Added the-graph hosted service subgraph to our incremental static regeneration strategy.

## [3.0.0] - 2022-12-28

-   We added support to PoS v2. But it will only be deployed, and rollout will come later. [Feature flagged]
-   We removed the code that supported the old onboard-js version 1.
-   We added a new node history feature for private node and pool management in the node section. Users can see the last three retired nodes.
-   We added code changes for page generation using ISR to improve SEO results for staking pools with an ENS name.
-   We changed the rendering behavior of the staking pool page when using an invalid address. Now a not found page is rendered instead, and that avoids confusion and possibly misleading.

## [2.12.4] - 2022-12-19

-   We updated the calculation for CTSI staked on staking pool users page. A wallet connection is not required to see the total CTSI staked by each address.
-   We fixed a problem on stake page. Where the input inside the modal for deposit and stake would be stale after the user closed it. That forced the user to erase the value and type again so the button would be enabled again.
-   We removed the code that supported the old node-runners page
-   We removed the code that supported the old pool management and creation screens.

## [2.12.3] - 2022-12-13

-   Update home page tooltip copy.
-   Fix UI issues for desktop on stake page.
-   Removed code that supported the old pool list page.
-   Removed code that supported the old staking pool page.

## [2.12.2] - 2022-12-12

-   Update a few tooltip information in the home page.

## [2.12.1] - 2022-12-07

-   Fix the counting at "my pools" banner information. When the wallet was disconnected it was returning the first 50 balances without any user account filtering.

## [2.12.0] - 2022-12-06

-   The staking pool's new users page feature is ready to be roll out.
-   Added support to the new Gnosis Sage a.k.a Safe official URL. https://app.safe.global/
-   Pool managers when clicking the edit button in the staking pool page are now redirected to the new management screen instead of the old one. Also, the back button in the management screen knows where to go back to.
-   Migration from universal analytics to google analytics 4 a.k.a GA4 is done. Google will sunset universal analytics in 2023.
-   The transaction alerts for the pool settings area in the new management screen were updated. They all comply with the new design.
-   Alignment fixes in the pool tables for the action column (e.g. stake / info) on Home and Stake pages on small screens.
-   UI update in the Home page producers table when dark mode is active. The action column had a different color shade.

## [2.11.0] - 2022-11-28

-   Updates applied in the commission input for Gas based pool in the new pool management page.
-   UI fixes for better visual on dark mode.
-   Updates applied to the page meta title to improve SEO.
-   New set of icons added to the list of pools, staking pool details and stake areas.

## [2.10.1] - 2022-11-17

-   Fix the undesired flash message for the deposit maturing message.
-   Fix the remaining seconds (milliseconds) by rounding the number.

## [2.10.0] - 2022-11-16

-   The staking pool's new commission page is ready to be roll out.
-   UI updates done to improve the consistency of dark mode colours between the home and stake pages.
-   We optimise the render time in the blocks page when doing the initial load of information.
-   UI updates were applied in the Node Runners landing page. The update targeted the pool's table presentation.
-   UI updates done in the new pool management screen.
-   UI updates done to the new node management screen. Mostly visual improvements e.g. input sizes and colours.
-   We improved the alerts visibility in the new creation flow for pools and private node that starts in the node runners landing page.

## [2.9.1] - 2022-11-02

-   Fix visibility on light mode for the pool's table manage icon on node runners page.

## [2.9.0] - 2022-10-27

-   Fresh new home page look.
-   Fix for the positioning of the stake button in the list of pools. That is always visible now.
-   A new wallet interface is ready to be roll-out.
-   Fixes in the node-runners page. From landing page to a few updates in the management screens.
-   UI framework and core render libraries upgraded.
-   UI fixes for the address in dark mode. The font color was still black even on dark mode making it invisible.

## [2.8.3] - 2022-10-08

-   Fix a bug on my staking pools area where the unstake and stake column values were displaying as zero all the time.
-   Fix a visibility problem on dark mode for the stake/info where the background would stay white color and the icon would become white and disappear.

## [2.8.2] - 2022-10-07

-   Fixes for the navigation menu links and page redirects.

## [2.8.1] - 2022-10-07

-   Design adjustment for small screens in the node section for both private node and public pool management.
-   New stake page design is ready to roll-out.

## [2.8.0] - 2022-09-30

-   New Node Runners page and workflows are ready for roll-out.

## [2.7.3] - 2022-09-20

-   Added max deposit feature in the staking pool page. The smallest amount between the allowance and the user's CTSI balance will be used to fill the deposit amount.

## [2.7.2] - 2022-09-08

-   Layout design updates in the pool staking page.
-   Removed the allowance cap inside the deposit modal quick allowance setup.

## [2.7.1] - 2022-09-06

-   Update the pool allowance functionality. The allowance capped by the users CTSI balance is removed leaving the user free to set bigger amounts that saves unnecessary ETH expenditure.

## [2.7.0] - 2022-09-01

-   Improved UX for the wallet connected. Users now can click in the displayed address and see a menu with actions they can do. Besides the usual disconnect and switch accounts **(for Hardware wallet only)** a new action is available to copy the connected address.

## [2.6.2] - 2022-08-26

-   Changes to the titles of each explorer page to avoid wrong data aggregation on GA.

## [2.6.1] - 2022-08-19

-   Fix problem when trying to do deposits using the Gnosis Safe wallet.
-   Added google tag manager to collate the traffic data on explorer and have a holistic idea of traffic behaviour across Cartesi websites.
-   Updated UI elements in the new staking page.
-   Fixed problem when hiring a node for the pool. In a specific case the pool info mistakenly would fill the node form.

## [2.6.0] - 2022-08-04

-   New Staking Page workflow is ready to be roll-out.
-   Fix for stale data problem spotted on 'My Pools' after staking activities and when the wallet is disconnected. This fix also covers a widget in the home and node-runners page.

## [2.5.1] - 2022-07-27

-   Support to the `ropsten` testnet removed. [Deprecation due on Q4/2022](https://blog.ethereum.org/2022/06/21/testnet-deprecation/)

## [2.5.0] - 2022-05-31

-   Improved visual experience for hardware wallet's account selection (Ledger). Button that loads more accounts is not compressed.
-   Improved experience for hardware wallet users. When navigating through the menu links a wallet reconnection is not necessary.

## [2.4.4] - 2022-05-02

-   Fix for unleash feature flag not hydrating the context when switching accounts.
-   Fix feature flag evaluation for header menu on both big and small screens.

## [2.4.3] - 2022-04-26

### Changed

-   Fix google analytics not collecting data from trackers.

## [2.4.2] - 2022-03-30

### Changed

-   Fix error after disconnecting from wallet on node runners page.
-   Added analytics to track what kind of wallets are used.

## [2.4.1] - 2022-03-24

### Changed

-   UX improvement when clicking the connect wallet button. The menu closes automatically.
-   [Ankr](https://www.ankr.com/) service added as an blockchain infra provider.

## [2.4.0] - 2022-03-09

### Changed

-   Visual identity updated following the new branding.

## [2.3.0] - 2022-02-07

### Changed

-   Display of pool maturing and release countdown
-   Fix information about average pool production interval

## [2.2.0] - 2022-01-27

### Changed

-   Support to new wallets added.
    -   [Metamask](https://metamask.io/)
    -   [Coinbase Wallet](https://www.coinbase.com/wallet)
    -   [Trust](https://trustwallet.com/)
    -   [Ledger](https://www.ledger.com/)
    -   [Gnosis Safe](https://gnosis-safe.io/)
    -   [Wallet Connect](https://walletconnect.com/)
-   Testnets `kovan` and `rinkeby` were removed.

## [2.1.0] - 2021-12-10

### Changed

-   Pools performance (feature flag controlled)
-   Using AWS infrastructure (feature flag controlled)
-   Fix ENS resolution bug
-   Fix user pool balance without connected wallet
-   Fix display of gas tax pool

## [2.0.5] - 2021-11-24

### Changed

-   Retire confirmation dialog
-   Display of table on mobile with horizontal scrolling
-   Showing pool participation with more precision
-   Showing ENS also on home page list of producers
-   Improve withdraw dialog to show max amount

## [2.0.4] - 2021-11-06

### Changed

-   Display of zero accrued commission

## [2.0.3] - 2021-10-31

### Changed

-   Display of zero commission label

## [2.0.2] - 2021-10-27

### Changed

-   Limit of pool icon size
-   Link to staking article
-   Back link in the pool page
-   Mobile improvements

## [2.0.1] - 2021-10-24

### Changed

-   Changed main menu to avoid confusion
-   Fix blocks layout on home page
-   Using udpated subgraph with stake maturation information
-   Fix display of chance of production in staking page

## [2.0.0] - 2021-09-30

Staking Pools

## [1.1.0] - 2021-02-02

### Changed

-   New tinygraphs server at https://tinygraphs.cartesi.io
-   Changed CTSI approve and stake buttons

### Added

-   New API at https://explorer.cartesi.io/api/mainnet/stats

## [1.0.0] - 2021-01-25

-   First release

[unreleased]: https://github.com/cartesi/explorer/compare/v3.8.4...HEAD
[3.8.4]: https://github.com/cartesi/explorer/compare/v3.8.4...v3.8.3
[3.8.3]: https://github.com/cartesi/explorer/compare/v3.8.3...v3.8.2
[3.8.2]: https://github.com/cartesi/explorer/compare/v3.8.2...v3.8.1
[3.8.1]: https://github.com/cartesi/explorer/compare/v3.8.1...v3.8.0
[3.8.0]: https://github.com/cartesi/explorer/compare/v3.8.0...v3.7.1
[3.7.1]: https://github.com/cartesi/explorer/compare/v3.7.1...v3.7.0
[3.7.0]: https://github.com/cartesi/explorer/compare/v3.7.0...v3.6.2
[3.6.2]: https://github.com/cartesi/explorer/compare/v3.6.1...v3.6.2
[3.6.1]: https://github.com/cartesi/explorer/compare/v3.6.0...v3.6.1
[3.6.0]: https://github.com/cartesi/explorer/compare/v3.5.2...v3.6.0
[3.5.2]: https://github.com/cartesi/explorer/compare/v3.5.1...v3.5.2
[3.5.1]: https://github.com/cartesi/explorer/compare/v3.5.0...v3.5.1
[3.5.0]: https://github.com/cartesi/explorer/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/cartesi/explorer/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/cartesi/explorer/compare/v3.2.2...v3.3.0
[3.2.2]: https://github.com/cartesi/explorer/compare/v3.2.1...v3.2.2
[3.2.1]: https://github.com/cartesi/explorer/compare/v3.2.0...v3.2.1
[3.2.0]: https://github.com/cartesi/explorer/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/cartesi/explorer/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/cartesi/explorer/compare/v2.12.4...v3.0.0
[2.12.4]: https://github.com/cartesi/explorer/compare/v2.12.3...v2.12.4
[2.12.3]: https://github.com/cartesi/explorer/compare/v2.12.2...v2.12.3
[2.12.2]: https://github.com/cartesi/explorer/compare/v2.12.1...v2.12.2
[2.12.1]: https://github.com/cartesi/explorer/compare/v2.12.0...v2.12.1
[2.12.0]: https://github.com/cartesi/explorer/compare/v2.11.0...v2.12.0
[2.11.0]: https://github.com/cartesi/explorer/compare/v2.10.1...v2.11.0
[2.10.1]: https://github.com/cartesi/explorer/compare/v2.10.0...v2.10.1
[2.10.0]: https://github.com/cartesi/explorer/compare/v2.9.1...v2.10.0
[2.9.1]: https://github.com/cartesi/explorer/compare/v2.9.0...v2.9.1
[2.9.0]: https://github.com/cartesi/explorer/compare/v2.8.3...v2.9.0
[2.8.3]: https://github.com/cartesi/explorer/compare/v2.8.2...v2.8.3
[2.8.2]: https://github.com/cartesi/explorer/compare/v2.8.1...v2.8.2
[2.8.1]: https://github.com/cartesi/explorer/compare/v2.8.0...v2.8.1
[2.8.0]: https://github.com/cartesi/explorer/compare/v2.7.3...v2.8.0
[2.7.3]: https://github.com/cartesi/explorer/compare/v2.7.2...v2.7.3
[2.7.2]: https://github.com/cartesi/explorer/compare/v2.7.1...v2.7.2
[2.7.1]: https://github.com/cartesi/explorer/compare/v2.7.0...v2.7.1
[2.7.0]: https://github.com/cartesi/explorer/compare/v2.6.2...v2.7.0
[2.6.2]: https://github.com/cartesi/explorer/compare/v2.6.1...v2.6.2
[2.6.1]: https://github.com/cartesi/explorer/compare/v2.6.0...v2.6.1
[2.6.0]: https://github.com/cartesi/explorer/compare/v2.5.1...v2.6.0
[2.5.1]: https://github.com/cartesi/explorer/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/cartesi/explorer/compare/v2.4.4...v2.5.0
[2.4.4]: https://github.com/cartesi/explorer/compare/v2.4.3...v2.4.4
[2.4.3]: https://github.com/cartesi/explorer/compare/v2.4.2...v2.4.3
[2.4.2]: https://github.com/cartesi/explorer/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/cartesi/explorer/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/cartesi/explorer/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/cartesi/explorer/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/cartesi/explorer/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/cartesi/explorer/compare/v2.0.5...v2.1.0
[2.0.5]: https://github.com/cartesi/explorer/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/cartesi/explorer/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/cartesi/explorer/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/cartesi/explorer/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/cartesi/explorer/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/cartesi/explorer/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/cartesi/explorer/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cartesi/explorer/releases/tag/v1.0.0
