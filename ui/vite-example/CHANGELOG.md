# Changelog

## [1.6.0](https://github.com/chartdb/chartdb/compare/v1.5.1...v1.6.0) (2025-01-02)


### Features

* **view-menu:** add toggle for mini map visibility ([#496](https://github.com/chartdb/chartdb/issues/496)) ([#505](https://github.com/chartdb/chartdb/issues/505)) ([8abf2a7](https://github.com/chartdb/chartdb/commit/8abf2a7bfcc36d39e60ac133b0e5e569de1bbc72))


### Bug Fixes

* add loadDiagramFromData logic to chartdb provider ([#513](https://github.com/chartdb/chartdb/issues/513)) ([ee659ea](https://github.com/chartdb/chartdb/commit/ee659eaa038a94ee13801801e84152df4d79683d))
* **dependency:** upgrade react query to v7 - clean console warnings ([#504](https://github.com/chartdb/chartdb/issues/504)) ([7c5db08](https://github.com/chartdb/chartdb/commit/7c5db0848e49dfdb7e7120f77003d1e37f8d71b0))
* **i18n:** translation/Arabic ([#509](https://github.com/chartdb/chartdb/issues/509)) ([4b43f72](https://github.com/chartdb/chartdb/commit/4b43f720e90e49d5461e68d188e3865000f52497))

## [1.5.1](https://github.com/chartdb/chartdb/compare/v1.5.0...v1.5.1) (2024-12-15)


### Bug Fixes

* **export:** fix SQL server field.nullable type to boolean ([#486](https://github.com/chartdb/chartdb/issues/486)) ([a151f56](https://github.com/chartdb/chartdb/commit/a151f56b5d950e0b5cc54363684ada95889024b3))
* **readme:** Update README.md - add CockroachDB ([#482](https://github.com/chartdb/chartdb/issues/482)) ([2b6b733](https://github.com/chartdb/chartdb/commit/2b6b73326155f18d6d56779c0657a3506e2d2cde))

## [1.5.0](https://github.com/chartdb/chartdb/compare/v1.4.0...v1.5.0) (2024-12-11)


### Features

* **CockroachDB:** Add CockroachDB support ([#472](https://github.com/chartdb/chartdb/issues/472)) ([5409288](https://github.com/chartdb/chartdb/commit/54092883883b135f6ace51d86754b1df76603d30))
* **i18n:** translate share and dialog sections in Indonesian locale files ([#468](https://github.com/chartdb/chartdb/issues/468)) ([3574cec](https://github.com/chartdb/chartdb/commit/3574cecc7c73dcab404b82115d20e1ad0cd26b37))


### Bug Fixes

* **core:** fix update diagram id ([#477](https://github.com/chartdb/chartdb/issues/477)) ([348f805](https://github.com/chartdb/chartdb/commit/348f80568e0f686ee478147fdc43a5d43b5c1ebb))
* **dialogs:** fix footer position on dialogs ([#470](https://github.com/chartdb/chartdb/issues/470)) ([2309306](https://github.com/chartdb/chartdb/commit/2309306ef590783b00a2489209092107dd9a3788))
* **sql-server import:** nullable should be boolean instead of string ([#480](https://github.com/chartdb/chartdb/issues/480)) ([635fb53](https://github.com/chartdb/chartdb/commit/635fb53c9f7ebd1e5ef4d9274af041edc08f04c3))

## [1.4.0](https://github.com/chartdb/chartdb/compare/v1.3.1...v1.4.0) (2024-12-02)


### Features

* **add templates:** add six more templates  ([#452](https://github.com/chartdb/chartdb/issues/452)) ([be1b109](https://github.com/chartdb/chartdb/commit/be1b109f23e62df4cc63fa8914c2754f7809cc08))
* **add templates:** add six more templates (django-axes, laravel-activitylog, octobox, pay-rails, pixelfed, polr) ([#460](https://github.com/chartdb/chartdb/issues/460)) ([03772f6](https://github.com/chartdb/chartdb/commit/03772f6b4f99f9c4350356aa0f2a4666f4f1794d))
* **add templates:** add six more templates (reversion, screeenly, staytus, deployer, devise, talk) ([#457](https://github.com/chartdb/chartdb/issues/457)) ([ddeef3b](https://github.com/chartdb/chartdb/commit/ddeef3b134efa893e1c1e15e2f87c27157200e2d))
* **clickhouse:** add ClickHouse support ([#463](https://github.com/chartdb/chartdb/issues/463)) ([807cd22](https://github.com/chartdb/chartdb/commit/807cd22e0c739f339fa07fe1d2f043c5411ae41f))
* **i18n:** Added bangla translations ([#432](https://github.com/chartdb/chartdb/issues/432)) ([885eb71](https://github.com/chartdb/chartdb/commit/885eb719de577c2652fbed1ed287f38fcc98c148))
* **side-panel:** Add functionality of order tables by drag & drop ([#425](https://github.com/chartdb/chartdb/issues/425)) ([a0e966b](https://github.com/chartdb/chartdb/commit/a0e966b64f8070d4595d47b2fb39e8bbf427b794))


### Bug Fixes

* **clipboard:** defensive for navigator clipboard ([#462](https://github.com/chartdb/chartdb/issues/462)) ([5fc10a7](https://github.com/chartdb/chartdb/commit/5fc10a7e649fc5877bb297b519b1b6a8b81f1323))
* **import-database:** update database type after importing into an existing generic diagra ([#456](https://github.com/chartdb/chartdb/issues/456)) ([a8fe491](https://github.com/chartdb/chartdb/commit/a8fe491c1b5a30d9f4144cefa9111dd3dfd5df1a))
* **Last Saved:** Translate the "last saved" relative date message ([#400](https://github.com/chartdb/chartdb/issues/400)) ([d45677e](https://github.com/chartdb/chartdb/commit/d45677e92d72efc6cea8f865ce46f0be6ec9961f))
* **mariadb-types:** Add uuid data type ([#459](https://github.com/chartdb/chartdb/issues/459)) ([94656ec](https://github.com/chartdb/chartdb/commit/94656ec7a5435c2da262fb3bc6a6d381d554b0c1))
* window type ([#454](https://github.com/chartdb/chartdb/issues/454)) ([9c7d03c](https://github.com/chartdb/chartdb/commit/9c7d03c285ff6f818eef3199c9b7a530d03a1fec))

## [1.3.1](https://github.com/chartdb/chartdb/compare/v1.3.0...v1.3.1) (2024-11-26)


### Bug Fixes

* **docker:** make OPENAI_API_KEY optional in docker run ([#448](https://github.com/chartdb/chartdb/issues/448)) ([4bb4766](https://github.com/chartdb/chartdb/commit/4bb4766e1ac8d69e138668eb8a46de5affe62ceb))

## [1.3.0](https://github.com/chartdb/chartdb/compare/v1.2.0...v1.3.0) (2024-11-25)


### Features

* **side panel:** collapsible side panel on desktop view + keyboard shortcut ([#439](https://github.com/chartdb/chartdb/issues/439)) ([70f545f](https://github.com/chartdb/chartdb/commit/70f545f78bab9c510a6e5936fa5b259b806b6c69))


### Bug Fixes

* **dialogs:** fix height of dialogs for small screens ([#440](https://github.com/chartdb/chartdb/issues/440)) ([667685e](https://github.com/chartdb/chartdb/commit/667685ed0f6a8cc61ae86b3ba60e052fbe6a9e1a))
* **drawer:** set fix min size ([#429](https://github.com/chartdb/chartdb/issues/429)) ([c5e0ea6](https://github.com/chartdb/chartdb/commit/c5e0ea6fa4017666ff3bc1e3071c487df48afd3d))
* **export-sql:** add unique to export script ([#422](https://github.com/chartdb/chartdb/issues/422)) ([b75c6fe](https://github.com/chartdb/chartdb/commit/b75c6fe4e78f3e2058be680f2fa0442db3b4a6bd))
* fix layout warnings ([#434](https://github.com/chartdb/chartdb/issues/434)) ([94ec43b](https://github.com/chartdb/chartdb/commit/94ec43b60845bb8c3592ce1b1450ca0171a53f99))
* **i18n:** add bahasa indonesia translation ([#331](https://github.com/chartdb/chartdb/issues/331)) ([ab07da0](https://github.com/chartdb/chartdb/commit/ab07da0b031f0d4050ff6b44ddcb94cb6c0010b6))
* **i18n:** add missing type to vi.ts ([#444](https://github.com/chartdb/chartdb/issues/444)) ([e77ee60](https://github.com/chartdb/chartdb/commit/e77ee60a5b47e0854d11b0ee2f16d6956737d0ff))
* **i18n:** Add Telugu Language ([#352](https://github.com/chartdb/chartdb/issues/352)) ([8749591](https://github.com/chartdb/chartdb/commit/8749591be036e131de4bfeed1e6eece8d62980dd))
* **i18n:** add Turkish translations ([#315](https://github.com/chartdb/chartdb/issues/315)) ([d9fcbee](https://github.com/chartdb/chartdb/commit/d9fcbeec726b7bde9f7d202bf09dc6b617e3ad80))
* **i18n:** add Vietnamese translations ([#435](https://github.com/chartdb/chartdb/issues/435)) ([6c65c2e](https://github.com/chartdb/chartdb/commit/6c65c2e9cce600b9778b84ce5b5f1625dc6f1a58))
* **i18n:** Translating to Gujarati language ([#433](https://github.com/chartdb/chartdb/issues/433)) ([2940431](https://github.com/chartdb/chartdb/commit/2940431efa1a6aa54d80c61d5e05f0ad47cd67ba))
* **i18n:** Translation of the export error into Russian ([#418](https://github.com/chartdb/chartdb/issues/418)) ([7c3c628](https://github.com/chartdb/chartdb/commit/7c3c62860efc98d3aabf2132a79ac945ffc8315a))
* **i18n:** update korean for 1.2.0 ([#419](https://github.com/chartdb/chartdb/issues/419)) ([8397bef](https://github.com/chartdb/chartdb/commit/8397bef3924610d94661aae99c55ba4fa376a186))
* **import script:** remove double quotes ([#442](https://github.com/chartdb/chartdb/issues/442)) ([fb702c8](https://github.com/chartdb/chartdb/commit/fb702c87ce5254bf6e0209c692305f5086956090))
* **share:** fix export to handle broken indexes & relationships ([#416](https://github.com/chartdb/chartdb/issues/416)) ([4be3592](https://github.com/chartdb/chartdb/commit/4be3592cf4d160be83ddf1db01ffe9afdef119fa))
* **templates:** add Five more templates (bouncer, cabot, feedbin, Pythonic, flarum, freescout) ([#441](https://github.com/chartdb/chartdb/issues/441)) ([eaa0678](https://github.com/chartdb/chartdb/commit/eaa067814fd96fcc1ee10488ee747a71a8e8ec7a))

## [1.2.0](https://github.com/chartdb/chartdb/compare/v1.1.0...v1.2.0) (2024-11-17)


### Features

* **duplicate table:** duplicate table from the canvas and sidebar ([#404](https://github.com/chartdb/chartdb/issues/404)) ([44cf5ca](https://github.com/chartdb/chartdb/commit/44cf5ca264f52851f2dffb51a752a52b6fa7ec8d))


### Bug Fixes

* **AI exports:** add cahching layer to SQL exports ([#390](https://github.com/chartdb/chartdb/issues/390)) ([e5dbbf2](https://github.com/chartdb/chartdb/commit/e5dbbf2eaab6d80a531d451211b6f5a415bc7ce3))
* **canvas:** fix auto zoom on diagram load ([#395](https://github.com/chartdb/chartdb/issues/395)) ([492c932](https://github.com/chartdb/chartdb/commit/492c9324d27b561470c4967ce2e99f82eec467d8))
* **dockerfile:** support SPA refresh to resolve nginx return 404 ([#384](https://github.com/chartdb/chartdb/issues/384)) ([eaf75ce](https://github.com/chartdb/chartdb/commit/eaf75cedb0e024236c7684bb533856d7f80074da))
* **docs:** update license reference ([#403](https://github.com/chartdb/chartdb/issues/403)) ([44d10c2](https://github.com/chartdb/chartdb/commit/44d10c23907165288951a9d2ec3165ad23f81c61))
* **export image:** Add support for displaying cardinality relationships + background ([#407](https://github.com/chartdb/chartdb/issues/407)) ([68474e7](https://github.com/chartdb/chartdb/commit/68474e75d56ed4b4b445cc9b7f59cca96a4ca5db))
* **i18n:** add Nepali translations ([#406](https://github.com/chartdb/chartdb/issues/406)) ([e1e55c4](https://github.com/chartdb/chartdb/commit/e1e55c4b2ac7755b0810dc1f21da44903fe68a54))
* **i18n:** change language keeps selected language also after refreshing the page ([#409](https://github.com/chartdb/chartdb/issues/409)) ([f35f62f](https://github.com/chartdb/chartdb/commit/f35f62fdf38ca84065f171a31b80aa8123b1d8b9))
* **i18n:** Create Translations in Marathi language ([#266](https://github.com/chartdb/chartdb/issues/266)) ([c6f7ff7](https://github.com/chartdb/chartdb/commit/c6f7ff70f841efb9cf1766338f409fe0ea7bb998))
* **i18n:** fix language nav: close when lang selected, hide tooltip when lang selected ([#411](https://github.com/chartdb/chartdb/issues/411)) ([02aaabd](https://github.com/chartdb/chartdb/commit/02aaabdc4e9b1570d81ff03fe1e6da0307f22999))
* **templates:** add five more templates (Sylius, Monica, Attendize, SaaS Pegasus & BookStack) ([#408](https://github.com/chartdb/chartdb/issues/408)) ([0f67394](https://github.com/chartdb/chartdb/commit/0f673947af469e86f70737427ac8fb3c2420d1a2))
* **templates:** add six more templates (ticketit, snipe-it, refinerycms, comfortable-mexican-sofa, buddypress, lobsters) ([#402](https://github.com/chartdb/chartdb/issues/402)) ([07d3745](https://github.com/chartdb/chartdb/commit/07d374574775d132e1cba0908c47dcbbd6cd2c3f))
* **templates:** fix cloned indexes from a template ([#398](https://github.com/chartdb/chartdb/issues/398)) ([9f8500f](https://github.com/chartdb/chartdb/commit/9f8500fc7e36e6a819ecb9029f263d80eac88279))
* **templates:** fix tags urls ([#405](https://github.com/chartdb/chartdb/issues/405)) ([fe8b9f9](https://github.com/chartdb/chartdb/commit/fe8b9f9e91481d8a3272113b6f4be4da8d61ad04))
* **templates:** tag urls lowercase to support browsers ([#397](https://github.com/chartdb/chartdb/issues/397)) ([959e540](https://github.com/chartdb/chartdb/commit/959e5402b8c112fae6243ce9283947057506c128))

## [1.1.0](https://github.com/chartdb/chartdb/compare/v1.0.1...v1.1.0) (2024-11-13)


### Features

* **add templates:** add five more templates (laravel, django, twitter… ([#371](https://github.com/chartdb/chartdb/issues/371)) ([20b3396](https://github.com/chartdb/chartdb/commit/20b3396ec2afff09ca8bcdd91f5c6284c93cd959))
* **canvas:** Added Snap to grid functionality. Toggle/hold shift to enable snap to grid. ([#373](https://github.com/chartdb/chartdb/issues/373)) ([6c7eb46](https://github.com/chartdb/chartdb/commit/6c7eb4609d8466278de30317665929ec529c1f94))
* **share:** add sharing capabilities to import and export diagrams ([#365](https://github.com/chartdb/chartdb/issues/365)) ([94a5d84](https://github.com/chartdb/chartdb/commit/94a5d84fae819b0de6c1e471d1aad16dc8f39dd6))


### Bug Fixes

* **bundle:** fix bundle size ([#382](https://github.com/chartdb/chartdb/issues/382)) ([4ca1832](https://github.com/chartdb/chartdb/commit/4ca18327324106950f0d1af851b9b74379b67b7b))
* **dockerfile:** support openai key in docker build ([#366](https://github.com/chartdb/chartdb/issues/366)) ([545e857](https://github.com/chartdb/chartdb/commit/545e8578c9e8aa71696f6aa8bec81cacaa602c2d))
* **i18n:** add korean ([#362](https://github.com/chartdb/chartdb/issues/362)) ([b305be8](https://github.com/chartdb/chartdb/commit/b305be82aee00994ef576ca6fd62d72dd491f771))
* **i18n:** Add simplified chinese ([#385](https://github.com/chartdb/chartdb/issues/385)) ([9f28933](https://github.com/chartdb/chartdb/commit/9f2893319a1a2aed9a7c03d15e25a17ab37c2465))
* **i18n:** Added Russian language ([#376](https://github.com/chartdb/chartdb/issues/376)) ([2c69b08](https://github.com/chartdb/chartdb/commit/2c69b08eaea6b86ce0c1ddb18a23e22629198bf5))
* **i18n:** added traditional Chinese language translation ([#356](https://github.com/chartdb/chartdb/issues/356)) ([123f40f](https://github.com/chartdb/chartdb/commit/123f40f39e703ad612635964af530ac72c387d3c))
* **i18n:** Fixed part of RU lang introduced in [#365](https://github.com/chartdb/chartdb/issues/365) feat(share) ([#380](https://github.com/chartdb/chartdb/issues/380)) ([5508c1e](https://github.com/chartdb/chartdb/commit/5508c1e084e0ee24d1a54f721f760b9fc14df107))
* **i18n:** french translation update - share menu ([#391](https://github.com/chartdb/chartdb/issues/391)) ([e3129ce](https://github.com/chartdb/chartdb/commit/e3129cec744d18f09953544d9e74cd5adc4e8afb))
* **import json:** for Check Script Result, default with quotes ([#358](https://github.com/chartdb/chartdb/issues/358)) ([1430d2c](https://github.com/chartdb/chartdb/commit/1430d2c2365b7b74e36b8ff9d32a163d7437448a))
* improve title name edit interaction ([#367](https://github.com/chartdb/chartdb/issues/367)) ([84e7591](https://github.com/chartdb/chartdb/commit/84e7591d0586b9a457f31737c6e363ef41574142))
* **share:** add loader to the export ([#381](https://github.com/chartdb/chartdb/issues/381)) ([3609bfe](https://github.com/chartdb/chartdb/commit/3609bfea4d4c78b03711ff8d721b4e67bf82185a))
* **sql export:** make loading for export interactive ([#388](https://github.com/chartdb/chartdb/issues/388)) ([125a39f](https://github.com/chartdb/chartdb/commit/125a39fb5be803f0e6db0b68fb5bc8e290fa8dae))
* **templates:** change the template url to be database instead of db ([#374](https://github.com/chartdb/chartdb/issues/374)) ([f1d073d](https://github.com/chartdb/chartdb/commit/f1d073d05383955da6f60a9a66ed2be879b103e4))
* **templates:** fix issue with double-clone on localhost ([#394](https://github.com/chartdb/chartdb/issues/394)) ([78c427f](https://github.com/chartdb/chartdb/commit/78c427f38e5c64fc340d13ceb2153c2b85db437e))

## [1.0.1](https://github.com/chartdb/chartdb/compare/v1.0.0...v1.0.1) (2024-11-06)


### Bug Fixes

* **offline:** add support when running on isolated network ([#359](https://github.com/chartdb/chartdb/issues/359)) ([aa884b4](https://github.com/chartdb/chartdb/commit/aa884b49ce16d70f67881bdc940993c1fe901796))
* open default diagram after deleting current diagram ([#350](https://github.com/chartdb/chartdb/issues/350)) ([87a40cf](https://github.com/chartdb/chartdb/commit/87a40cff615b04b678642ba2d6e097c38b26d239))
* **select-box:** allow using tab & space to show choices ([#336](https://github.com/chartdb/chartdb/issues/336)) ([93f623a](https://github.com/chartdb/chartdb/commit/93f623a13a61e9143638fbe7e8346f07e37a26b2))
* **smart query:** import postgres FKs ([#357](https://github.com/chartdb/chartdb/issues/357)) ([acb736e](https://github.com/chartdb/chartdb/commit/acb736e44fd50d29a85b4eff42e20780aef710ed))
* **templates:** add two more templates (Airbnb, Wordpress) ([#317](https://github.com/chartdb/chartdb/issues/317)) ([ebce882](https://github.com/chartdb/chartdb/commit/ebce8827eab049eefa0eebcb0ec2540698bc0e15))
* **templates:** align database icon ([#351](https://github.com/chartdb/chartdb/issues/351)) ([efaddee](https://github.com/chartdb/chartdb/commit/efaddeebb4f24235d82f4e2bf7423fbf48b97187))
* **template:** separator in case of empty url ([#355](https://github.com/chartdb/chartdb/issues/355)) ([180886c](https://github.com/chartdb/chartdb/commit/180886c5882f2329c797fc284b255012d21f5b5c))
* **templates:** fetch templates data from router ([#321](https://github.com/chartdb/chartdb/issues/321)) ([d8a20eb](https://github.com/chartdb/chartdb/commit/d8a20ebbd9118989690a40fcd3aa59fb156b446f))

## 1.0.0 (2024-11-04)


### Features

* ability to change zoom or pan on scroll in the canvas component ([ac208c4](https://github.com/chartdb/chartdb/commit/ac208c47dc307fd0dee5a987bb6ccde8d0599db7))
* add import logic based on the JSON input ([01f4e4b](https://github.com/chartdb/chartdb/commit/01f4e4bc6167c61e9c6b669a10a3f9c84ebc1774))
* add import logic based on the JSON input ([939ac22](https://github.com/chartdb/chartdb/commit/939ac2295f676796b46417433b5ec7625be29839))
* add release ([ac37475](https://github.com/chartdb/chartdb/commit/ac37475f370fb5e11271059aaf25ee98501d4523))
* add release ([80491ae](https://github.com/chartdb/chartdb/commit/80491aea4f9be7b72ced96245607a87b678ead6e))
* Added darkmode support, user and system preferences ([d63700f](https://github.com/chartdb/chartdb/commit/d63700fcfbfc4c65d4a17e93a4b5c48b0c65d9e4))
* added japanese language translation ([#235](https://github.com/chartdb/chartdb/issues/235)) ([588543f](https://github.com/chartdb/chartdb/commit/588543f324bfbec41f1ee67da856b47cc26b1ac2))
* change the menu to activate/deactive zoom on scroll ([a69b241](https://github.com/chartdb/chartdb/commit/a69b241d74f830ebb8f894935c154a53bba93da6))
* disable darkmode toggle until colors are fixed, remove class from create ([e2029da](https://github.com/chartdb/chartdb/commit/e2029da189b2feee772e7d9793ce01e59365f2ca))
* **fetcher:** add pg magic sql ([f74f208](https://github.com/chartdb/chartdb/commit/f74f208a860bf821fd9ace92ffbd91276ef6175c))
* improve dockerfile ([48a0f4f](https://github.com/chartdb/chartdb/commit/48a0f4f240f9fb603a66454e5deb4e7708c6a15d))


### Bug Fixes

* :bug: pk_column changed to column in sqlite ([f85a2d0](https://github.com/chartdb/chartdb/commit/f85a2d086d70e9aa5c63f52a297f290cb2590967))
* add contents permissions ([b896134](https://github.com/chartdb/chartdb/commit/b896134cae940197e6995191dd09124af30ad1a3))
* add permissions ([16a6166](https://github.com/chartdb/chartdb/commit/16a6166b4ad35e879c73ac19a52f8678aad183a8))
* add reference_schema to support again import with FKs ([ce8ef57](https://github.com/chartdb/chartdb/commit/ce8ef57304ab73912275bfbd60e1fee6fe4b104d))
* add reference_schema to support again import with FKs all dbs ([4d34ade](https://github.com/chartdb/chartdb/commit/4d34ade63deb6f4469970ed4fb1f0e4045aa451a))
* add reference_schema to the postgres import script ([48414da](https://github.com/chartdb/chartdb/commit/48414dac83e99d47f2bc195e003689f01602904f))
* add support to MySQL versions below 8.0 ([f2f74ad](https://github.com/chartdb/chartdb/commit/f2f74ad412dfec3a5795182709a949224d37a759))
* autofocus on mobile ([d5cb3e5](https://github.com/chartdb/chartdb/commit/d5cb3e5648203a1552d76818e73c7382b6234f3d))
* change to on push ([866f8f5](https://github.com/chartdb/chartdb/commit/866f8f5ff1aec15a190cad8958d134e9a4ce2a43))
* change to on push ([60f0317](https://github.com/chartdb/chartdb/commit/60f0317ce60c3a8c9dede120e6cfcbbaf4c55174))
* change to on push ([07da6d0](https://github.com/chartdb/chartdb/commit/07da6d05cf9faa809bb9d0f8cd02751f9fb137dc))
* change workflow name ([3770703](https://github.com/chartdb/chartdb/commit/377070391d5573ccaf81ce7bf508bd79393a3d1a))
* change workflow name ([3b4f256](https://github.com/chartdb/chartdb/commit/3b4f2565989247abf88dabd178ad48e188268e33))
* ci ([be04ac2](https://github.com/chartdb/chartdb/commit/be04ac2ff2b2ef17b066bd3a1228408effaa90c4))
* docker login ([de8ca35](https://github.com/chartdb/chartdb/commit/de8ca3580bcfd15ea741a518e78d5e778a8a4ed5))
* **i18n:** add missing German translations ([#311](https://github.com/chartdb/chartdb/issues/311)) ([b2c2045](https://github.com/chartdb/chartdb/commit/b2c20459d55c087f906305707290ac4cfc52055b))
* permissions ([f654418](https://github.com/chartdb/chartdb/commit/f6544186d04bdb54a8afb5489ca62391f8996b1f))
* permissions issue ([e51f4d3](https://github.com/chartdb/chartdb/commit/e51f4d3c1c5471e314c17dc90566e0c8f6e889b9))
* remove cache ([9877dd3](https://github.com/chartdb/chartdb/commit/9877dd3c5a57bfb3e8d3f7efa8e373de3071d217))
* remove cache ([be62368](https://github.com/chartdb/chartdb/commit/be6236877e6005bc326c78fd78529b25e6bec6cb))
* remove effective scroll action ([1c6786b](https://github.com/chartdb/chartdb/commit/1c6786bff44b1be65af814873e40749e37353fa4))
* remove multi platform build ([90fe199](https://github.com/chartdb/chartdb/commit/90fe199b09dd1e46b4b1b29ed9765879bf23c08b))
* remove multi platform build ([21e1a22](https://github.com/chartdb/chartdb/commit/21e1a223bf4fd7d8198ef838801a6c068a26a5ed))
* restrict relationship handle  on views ([a1734eb](https://github.com/chartdb/chartdb/commit/a1734eb376db2642405dc46a4beede8c3f9f79de))
* rounded table node ([21b3c91](https://github.com/chartdb/chartdb/commit/21b3c91d267f0c7f3c9de741365abc23712890a3))
* small update on mobile, add the word Saved ([0a11b6f](https://github.com/chartdb/chartdb/commit/0a11b6f88345126180031ab7359eb941c997c83b))
* support multi schemas when using import script in postgres ([1eff951](https://github.com/chartdb/chartdb/commit/1eff9513eff7c2e52f4752e59ad5afaed52d62eb))
* tag ([2bc8255](https://github.com/chartdb/chartdb/commit/2bc8255c58e0fbec32aeac13e9621e7db690ac7b))
* tag ([00d1792](https://github.com/chartdb/chartdb/commit/00d1792c733335e1c7e82e62cca0e3d3da827a68))
* to support all postgres schemas and not only public ([f203813](https://github.com/chartdb/chartdb/commit/f203813f689e10c5096cdd1a2f4e6b1991c02f33))
* update import queries and fix bug for MySQL & MariaDB ([89e0cdd](https://github.com/chartdb/chartdb/commit/89e0cddd42431ece364301bfb700a140c2df8368))
* uses docker/build-push-action@v5 ([4799d41](https://github.com/chartdb/chartdb/commit/4799d41cd131b8672635aeb71b19a6153b46f4c5))
* uses docker/build-push-action@v5 ([7358c9c](https://github.com/chartdb/chartdb/commit/7358c9c98971896274ffef245ab030897cefea93))
* when import MySQL database via smart query fix PKs import ([dac6059](https://github.com/chartdb/chartdb/commit/dac6059853833d865e0b8a86423b5dac7572e55f))
* zoom in/out on scroll instead of panning ([6a0bc30](https://github.com/chartdb/chartdb/commit/6a0bc30cdbfebed7c12d8ceeba39058d55c170fb))
