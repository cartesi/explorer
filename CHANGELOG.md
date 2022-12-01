# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
-   UI fixes for the address in dark mode. The font colour was still black even on dark mode making it invisible.

## [2.8.3] - 2022-10-08

-   Fix a bug on my staking pools area where the unstake and stake column values were displaying as zero all the time.
-   Fix a visibility problem on dark mode for the stake/info where the background would stay white colour and the icon would become white and disappear.

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

[unreleased]: https://github.com/cartesi-corp/explorer/compare/v2.11.0...HEAD
[2.11.0]: https://github.com/cartesi-corp/explorer/compare/v2.10.1...v2.11.0
[2.10.1]: https://github.com/cartesi-corp/explorer/compare/v2.10.0...v2.10.1
[2.10.0]: https://github.com/cartesi-corp/explorer/compare/v2.9.1...v2.10.0
[2.9.1]: https://github.com/cartesi-corp/explorer/compare/v2.9.0...v2.9.1
[2.9.0]: https://github.com/cartesi-corp/explorer/compare/v2.8.3...v2.9.0
[2.8.3]: https://github.com/cartesi-corp/explorer/compare/v2.8.2...v2.8.3
[2.8.2]: https://github.com/cartesi-corp/explorer/compare/v2.8.1...v2.8.2
[2.8.1]: https://github.com/cartesi-corp/explorer/compare/v2.8.0...v2.8.1
[2.8.0]: https://github.com/cartesi-corp/explorer/compare/v2.7.3...v2.8.0
[2.7.3]: https://github.com/cartesi-corp/explorer/compare/v2.7.2...v2.7.3
[2.7.2]: https://github.com/cartesi-corp/explorer/compare/v2.7.1...v2.7.2
[2.7.1]: https://github.com/cartesi-corp/explorer/compare/v2.7.0...v2.7.1
[2.7.0]: https://github.com/cartesi-corp/explorer/compare/v2.6.2...v2.7.0
[2.6.2]: https://github.com/cartesi-corp/explorer/compare/v2.6.1...v2.6.2
[2.6.1]: https://github.com/cartesi-corp/explorer/compare/v2.6.0...v2.6.1
[2.6.0]: https://github.com/cartesi-corp/explorer/compare/v2.5.1...v2.6.0
[2.5.1]: https://github.com/cartesi-corp/explorer/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/cartesi-corp/explorer/compare/v2.4.4...v2.5.0
[2.4.4]: https://github.com/cartesi-corp/explorer/compare/v2.4.3...v2.4.4
[2.4.3]: https://github.com/cartesi-corp/explorer/compare/v2.4.2...v2.4.3
[2.4.2]: https://github.com/cartesi-corp/explorer/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/cartesi-corp/explorer/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/cartesi-corp/explorer/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/cartesi-corp/explorer/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/cartesi-corp/explorer/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/cartesi-corp/explorer/compare/v2.0.5...v2.1.0
[2.0.5]: https://github.com/cartesi-corp/explorer/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/cartesi-corp/explorer/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/cartesi-corp/explorer/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/cartesi-corp/explorer/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/cartesi-corp/explorer/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/cartesi-corp/explorer/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/cartesi-corp/explorer/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cartesi-corp/explorer/releases/tag/v1.0.0
