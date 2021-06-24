// import { bet, betSmall } from "./percent-game/bet";
// import { BetType } from "./types/bet";
// import { collect } from "./percent-game/collect";
// import {
//   getAllHistory,
//   getBetHistory,
//   getUnCollectHistory,
// } from "./percent-game/getBetHistory";
// import {
//   getActiveBetRound,
//   getProcessingRound,
// } from "./percent-game/getMarketData";
// import { log } from "./utils/log";
// import { getMultiplier } from "./utils/getMultiplier";
// import type { Round } from "./types/round";
// import { numberFixed } from "./utils/number";
import { getProxy } from "./utils/proxy";
import axios from "axios";
import { MarketDataMonitor } from "./percent-game/marketDataMonitor";
import { betSmall } from "./percent-game/bet";
import { getUnCollectHistory } from "./percent-game/getBetHistory";
import { collect } from "./percent-game/collect";
import { getMultiplier } from "./utils/getMultiplier";
import { numberFixed } from "./utils/number";

let testBetTime = 10;

new MarketDataMonitor({
  onRoundChange: (round) => {
    const { totalAmount, id } = round;

    console.log(
      `#${id} 场次出现数据变动，当前总计投注${numberFixed(totalAmount, 3)}` +
        `| 赔率 大${getMultiplier(
          round.totalAmount,
          round.bullAmount,
          2
        )}:${getMultiplier(round.totalAmount, round.bearAmount, 2)}小`
    );

    if (totalAmount > 40 && testBetTime > 0) {
      betSmall({ amount: 0.005, round })
        .then(() => {
          console.log("😮😮😮😮😮😮😮😮投注成功", round.id);
          testBetTime--;
        })
        .catch((err) => console.error("😡😡😡😡😡😡投注失败", err.message));
    }
  },
  onRoundEnd: (round, next) => {
    console.log(
      `========游戏结束，${round.id}已结束, ${next.id}已开始========`
    );

    getUnCollectHistory().then((res) => {
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          const cur = res[i];
          // 如果有赢就回收
          console.log("🤩🤩🤩🤩🤩🤩🤩成功回收！");
          collect(Number(cur.id));
        }
      }
    });
  },
});

// console.log(getDecimalAmount(new BigNumber(0.01)));

// bet({ position: BetType.BULL, amount: 0.001, gasRate: 1.5 });

// collect(10087);

// getAllHistory().then((res) => console.log("asdasdasdasd", res));
//
// const logRound = (round: Round) => {
//   const { id, startAt } = round;
//   const endTime = startAt + 5 * 60;
//
//   const lastTime = endTime - Math.round(Date.now() / 1000);
//
//   return log(
//     `${id} | 剩余时间:${lastTime} | BULL:${getMultiplier(
//       round.totalAmount,
//       round.bullAmount
//     )} | BEAR:${getMultiplier(round.totalAmount, round.bearAmount)} | TOTAL:${
//       round.totalAmount
//     } | BETS:${round.totalBets}`
//   );
// };
//
// let currentId = "";
// let lastLogRound: Round = null;
// let testBetTime = 10;
// const get = () => {
//   return getActiveBetRound()
//     .then((round) => {
//       const { id, startAt, totalAmount } = round;
//       if (!currentId) {
//         currentId = id;
//       }
//       // console.log(round);
//       const endTime = startAt + 5 * 60;
//
//       const lastTime = endTime - Math.round(Date.now() / 1000);
//
//       if (currentId === id) {
//         let timeout = 500;
//         if (lastTime >= 5) {
//           timeout = 2500;
//         } else if (lastTime > -1) {
//           timeout = 1000;
//         } else if (lastTime > -6 && totalAmount > 40 && testBetTime > 0) {
//           // 投注
//           console.log("🙂投注！！！");
//           betSmall({ amount: 0.005, round }).then(() => {
//             console.log("投注成功");
//             testBetTime--;
//           });
//         }
//         setTimeout(() => get(), timeout);
//       } else {
//         console.log(`id ${id} 结束`);
//
//         return getProcessingRound()
//           .then(async (process) => {
//             // getUnCollectHistory().then((res) => {
//             //   if (res.length > 0) {
//             //     for (let i = 0; i < res.length; i++) {
//             //       const cur = res[i];
//             //       // 如果有赢就回收
//             //       console.log("🤩回收！");
//             //       collect(Number(cur.id));
//             //     }
//             //   }
//             // });
//             await logRound(process);
//             currentId = id;
//             return log("============END BET=============");
//           })
//           .then(() => {
//             get();
//           });
//       }
//
//       if (lastTime < 5) {
//         if (
//           lastLogRound &&
//           lastLogRound.totalAmount === round.totalAmount &&
//           lastLogRound.totalBets === round.totalBets
//         ) {
//           console.log("投注信息一致，不记录");
//         } else {
//           logRound(round);
//           lastLogRound = round;
//         }
//       }
//
//       console.log(
//         "当前可投注",
//         id,
//         "剩余时间",
//         lastTime,
//         `${Math.floor(lastTime / 60)}分${lastTime % 60}秒`
//       );
//     })
//     .catch((err) => {
//       console.error(err);
//       return log("数据计算异常：" + err.message);
//     });
// };

// get();

//
// getUnCollectHistory().then((res) => {
//   return console.log(res);
//   if (res.length > 0) {
//     for (let i = 0; i < res.length; i++) {
//       const cur = res[i];
//       // 如果有赢就回收
//       console.log("🤩回收！");
//       collect(Number(cur.round.id));
//     }
//   }
// });
// getActiveBetRound().then((round) => console.log("当前可投注中", round));
// getProcessingRound().then((round) => console.log("当前进行中", round));

// for (let i = 0; i < 10; i++) {
//   axios
//     .get("https://ifconfig.me/ip", {
//       responseType: "text",
//     })
//     .then((res) => console.log("ip", res.data))
//     .catch((err) => console.log(err.message));
// }
