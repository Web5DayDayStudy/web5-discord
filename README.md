# Web3 Discord Tools

- [x] Avail 领水
- [x] Babylon 领水
- [ ] ...

## 安装
```
yarn install
```

## 领水
> 当前仅支持`avail`与`babylon`领水

```
yarn cli faucet [project] -t [discord-token] -a [wallet-address]
```
支持`--headless`参数

# 原作者：https://github.com/xzone911/web3-discord
首先感谢开源分享。在原作者的基础上改了bbl的批量领水
```angular2html
使用方式：
1: 配置好faucets.json其中:
execInterval: 30000 // 时间间隔，每一次发送命令后的下个号的发送间隔时间

tokenMapArrays: [
    "token1=address1",
    "token2=address2"   // 领水的discord token 中间以=分割 bbl的地址
]

roundIntervalHours: 6 // 领水调度的时间间隔，单位是小时

2: 启动命令：yarn cli faucet babylon_auto

目前bbl的dc领水是6小时一次，理论上一天能领3-4次。注意间隔时间不要太短，会触发dc的频率检测。


** 
新增sbtc领水，配置好faucets.json的tokens与address，
然后命令：yarn cli faucet babylon_sbtc 启动
```
