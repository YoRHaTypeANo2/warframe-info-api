const wfaLibs = require('../../utils/wfaLibs');
const utils = require('../../utils/utils');
const wmApi = require('../../api/warframeMarket')

const warframeMarket = {
    getInfo: async function (name, page = 1, size = 10) {
        const objs = utils.getSaleWordFromLib(name, wfaLibs.libs.wm);
        if(objs.length > 0){
            const obj = wfaLibs.libs.wm.get(objs[0].key);
            const list = (await wmApi.orders(obj.code));
            return {
                name,
                page,
                size,
                total: list.size,
                word: obj,
                words: objs.slice(1, 11),
                statistics: (await wmApi.statistics(obj.code)).slice(-1)[0],
                seller: list.slice((page - 1) * size, page * size)
            }
        }
        return {
            name: name,
            word: null,
            words: [],
            seller: []
        };
    },
    robotFormatStr: async function (name) {
        const info = await this.getInfo(name, 1, 5);
        if(info.word == null && info.name !== ''){
            return `未找到任何与${info.name}相关的物品`
        }
        let res = `已为你查到 ${info.word.zh} \n` +
                  `估计价格区间：${info.statistics.min_price} - ${info.statistics.max_price} \n` +
                  `top5卖家信息： \n`;
        info.seller.slice(0, 5).forEach(item => {
            res += `ID: ${item.user.ingame_name}, 价格：${item.platinum}白金 \n`
        })
        return res;
    }
};

module.exports = warframeMarket;
