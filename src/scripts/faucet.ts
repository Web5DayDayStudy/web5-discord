import Puppet from "../puppet"
import {sayFaucetLog} from "../utils/promots"
import {readFile} from "fs/promises"
import PuppetOptions from "../utils/PuppetOptions";

interface FaucetOptions {
    token: string,
    account: string,
    headless?: boolean
}

export const runFaucet = async (project: string, options: FaucetOptions) => {
    sayFaucetLog()
    //if (!options.token) throw new Error("Discord token not set!")
    //if (!options.account) throw new Error("Faucet target address not set!")
    const str = await readFile("./faucets.json", "utf-8")
    const faucets = JSON.parse(str) as Record<string, {
        name: string,
        serverId: string,
        channelId: string,
        type: string,
        cycle: number,
        arg1: string,
        args: string[],
        tokenMapArrays: string[],
        execInterval: number,
        tokens: string[],
        address: string[]
    }>
    const faucetInfo = faucets[project]
    if (!faucetInfo) {
        throw new Error(`Faucet attempt failed: 'project' ${project} is not found in faucets.json.`)
    }
    const {
        name, serverId, channelId, type,
        cycle, arg1, args, tokenMapArrays, execInterval
        , tokens, address
    } = faucetInfo

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // const {token, account, headless} = options
    // const puppet = new Puppet(PuppetOptions(token, headless))
    // await puppet.start()
    // await puppet.goToChannel(serverId, channelId)
    if (type === 'msg') {
        // puppet.sendMessage(arg1 + ' ' + account)
        // setInterval(() => {
        //     puppet.sendMessage(arg1 + ' ' + account)
        // }, cycle * 1000)

        // 支持bbl
        if (name === "bbl") {
            for (let tokenStr of tokenMapArrays) {
                try {
                    let tokenArr = tokenStr.split("=");
                    let tmpToken = tokenArr[0]
                    let bblAddress = tokenArr[1]

                    console.log(`[use token]: ${tmpToken} `, new Date())
                    const puppet = new Puppet(PuppetOptions(tmpToken, true))
                    await puppet.start()
                    await puppet.goToChannel(serverId, channelId)
                    await puppet.sendCommand(arg1, bblAddress);
                    await puppet.closeBrowser()

                    console.log(`[execInterval]: next execution will be in ${execInterval} ms.....`)
                    await sleep(execInterval);
                } catch (err) {
                    console.error(err)
                }
            }
        }

        if (name === "bbl_sbtc") {
            for (let i = 0; i < tokens.length; i++) {
                try {
                    if (i >= address.length) {
                        continue;
                    }
                    let token = tokens[i]
                    let addr = address[i]
                    console.log(`[use token]: ${token} `, new Date())
                    const puppet = new Puppet(PuppetOptions(token, true))
                    await puppet.start()
                    await puppet.goToChannel(serverId, channelId)
                    await puppet.sendCommand(arg1, addr);
                    await puppet.closeBrowser()
                } catch (err) {
                    console.error(err)
                }
            }
        }

    } /*else {
        if (arg1 != null) {
            puppet.sendCommand(arg1, account);
            setInterval(() => {
                puppet.sendCommand(arg1, account);
            }, cycle * 1000);
        } else if (Array.isArray(args)) {
            let delay = 0;
            args.forEach(arg => {
                setTimeout(() => {
                    puppet.sendCommand(arg, account);
                }, delay);
                delay += 10000;
            });
            setInterval(() => {
                let delay = 0;
                args.forEach(arg => {
                    setTimeout(() => {
                        puppet.sendCommand(arg, account);
                    }, delay);
                    delay += 10000;
                });
            }, cycle * 1000);
        } else {
            throw new Error(`${project} args or arg1 not found.`);
        }
    }*/

}
