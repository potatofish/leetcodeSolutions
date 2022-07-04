const isDebug = false;
const isVerbose = (process.execPath.split("/home/fishy/").length > 1) && true;
const headAndFootOnly = true;
const CHAR_INDENT = "\t";
var logIndent = 0;
var log = getLogFns();

var debugTimeStamps = {};
// TODO make a different version that finds all twosomes and then pairs them with a third
/**
 * Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]]
 * such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
 * Notice that the solution set must not contain duplicate triplets.
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (aNumsArray) {
    const SET_TARGET = 0;
    log.vHeader(`*** [START] threeSums search [target=${SET_TARGET}] for an array nums of size ${aNumsArray.length}`);
    debugTimeStamps.threeSum = Date.now();
    var matchingThreeSums = threeSums(aNumsArray, SET_TARGET);
    log.vBullet((()=>{
        let outputString = "";
        matchingThreeSums.forEach((val)=>{outputString += `[${val}],`;});
        return outputString;
    })())
    const threeSumRuntime = Date.now() - debugTimeStamps.threeSum;
    log.vFooter(`*** [COMPLETE in ${threeSumRuntime}ms] threeSums search [target=${SET_TARGET}] for an array nums of size ${aNumsArray.length}`);
    return matchingThreeSums;
};
var threeSums = function (aNumsArray, target) {
    const emptyResult = [];
    const SET_SIZE = 3;
    // EARLY EXIT: return if array isn't big enough to form a triplet
    if (aNumsArray.length < SET_SIZE) {
        log.vBullet(`EARLY EMPTY EXIT: a nums of size ${aNumsArray.length} is not enough to form a triplet`);
        return emptyResult;
    }

    // copy the array so we don't damage the original
    let nums = [...aNumsArray];

    //sort the array
    debugTimeStamps.sort = Date.now();
    nums.sort((a, b) => { return Math.sign(a - b); });
    const sortRuntime = Date.now() - debugTimeStamps.sort;
    log.vBullet(`Sorted nums Array of size ${nums.length} in ${sortRuntime}ms`);

    // EARLY EXIT: return if target is lower than all remaining numbers)
    if (target < nums[0]) {
        log.vBullet(`EARLY EMPTY EXIT: Target (${target}) is lower than the smallest value in nums - ${nums[0]}`);
        return emptyResult;
    }

    // filter array removing numbers from nums for volumes of any individual
    // number greater than the size of the unique set we're trying to produce
    // e.g. in "threeSum([i,j,k,l])" where i=j=k=l
    //      as i,j,k = 1,2,3 results in a set of [3,3,3] 
    debugTimeStamps.filter = Date.now();
    let numCounts = {};
    let filteredNums = nums.filter((val, idx) => {
        if (typeof numCounts[val] === "undefined") {
            numCounts[val] = 0;
        }
        if (numCounts[val] < SET_SIZE) {
            numCounts[val]++;
            return true;
        }
    });
    const filterRuntime = Date.now() - debugTimeStamps.filter;
    log.vBullet(`Filtered nums Array of size ${nums.length} down to ${filteredNums.length} in ${filterRuntime}ms by removing excess duplicates`);
    nums = filteredNums;

    let idxI = 0;
    let idxOflastPossibleK = nums.length - 1;
    let uniqueTrioIdxs = [];
    let uniqueTrioVals = [];
    while (idxI < nums.length) {
        const valI = nums[idxI];
        const targetOfSumJK = target - valI;
        const valOfFirstPossibleJ = nums[idxI + 1];
        const valOfLastPossibleK = nums[idxOflastPossibleK];
        // EARLY EXIT: return if target is lower than all remaining numbers)
        if (targetOfSumJK < valOfFirstPossibleJ)
            break;

        const numsSliced = nums.slice(idxI + 1, idxOflastPossibleK + 1);
        // EARLY EXIT: return if array isn't big enough to form a triplet
        if (numsSliced.length < SET_SIZE - 1) {
            log.vBullet(`WHILE BREAK: a numsSliced of size ${numsSliced.length} is not enough to form a duo`);
            break;
        }

        log.verbose(`New target=${targetOfSumJK} for sum(nums[j,k]) /w i=${idxI}.`);
        log.vHeader(`+++ [START] twoSums search target=${targetOfSumJK} /w idxI=${idxI} in for ${numsSliced.length} nums`);
        debugTimeStamps.twoSums = Date.now();
        let matchingDuos = twoSums(numsSliced, targetOfSumJK);
        const twoSumsRuntime = Date.now() - debugTimeStamps.twoSums;
        log.vFooter(`+++ [COMPLETE in ${twoSumsRuntime}ms] twoSums search target=${targetOfSumJK} results in ${matchingDuos.length} duos`);

        log.vBullet(`Value @ first possible j=${valOfFirstPossibleJ} & @ last possible k=${valOfLastPossibleK}`);
        log.vBullet(`Sliced ${nums.length} nums down to ${numsSliced} for & found [${matchingDuos.length}] duos`);

        matchingDuos.forEach(idxMatch => {
            const idxJ = idxMatch[0] + idxI + 1;
            const idxK = idxMatch[1] + idxI + 1;
            const [valI, valJ, valK] = [nums[idxI], nums[idxJ], nums[idxK]];
            uniqueTrioIdxs.push([idxI, idxJ, idxK]);
            uniqueTrioVals.push([valI, valJ, valK]);

            log.vBullet(`Validated Triplet [${valI},${valJ},${valK}] in [${nums}] for [i,j,k]=[${idxI},${idxJ},${idxK}]`);
        });

        //FAST-FORWARD idxI past any duplicate nums[idxI] values;
        log.vBullet(`Current val=${valI} exists for ${numCounts[valI]} values of i`);
        idxI += numCounts[valI];
    }
    return uniqueTrioVals;
};
var twoSums = (aNumsArray, target) => {
    const emptyResult = [];
    const SET_SIZE = 2;
    // EARLY EXIT: return if array isn't big enough to form a duo
    if (aNumsArray.length < SET_SIZE)
        return emptyResult;

    let nums = [...aNumsArray];
    // EARLY EXIT: return if target is lower than all remaining numbers)
    if (target < nums[0])
        return emptyResult;

    let idxJ = 0;
    let idxK = aNumsArray.length - 1;
    let numsAreParsed = false;
    let twoSumMap = new Map();
    let targetsMissed = 0;
    while (idxJ < idxK) {
        const valJ = nums[idxJ];
        const valK = nums[idxK];
        const sumJK = valJ + valK;
        const sumOffByTarget = target - sumJK;
        const valJOffByTarget = target - valJ;
        const valKOffByTarget = target - valK;
        const sumOffsetSign = Math.sign(sumOffByTarget);
        // log.writeToVerboseBullet(`Target=${target} ${sumOffByTarget === 0 ? "hit": "missed by " + sumOffByTarget} for sum(nums[j,k])=${sumJK} /w [j,k]=[${idxJ},${idxK}].`);
        // if(valJOffByTarget <= 0) {
        //     log.writeToVerboseBullet(`WHILE BREAK: Target (${target}) is now unreachable. Sum(j:${valJ},k:${valK})=${sumJK} for [j,k]=[${idxJ},${idxK}] is off target by ${valJOffByTarget}`);
        //     break;
        // }
        if (sumOffByTarget === 0) {
            twoSumMap.set(JSON.stringify([valJ, valK]), JSON.stringify([idxJ, idxK]));
            // reset indexes, shifting fwdRead forward one
            idxK = nums.length - 1;
            idxJ++;
        }
        else {
            targetsMissed++;
            // log.verbose(`  valJ=${valJ} missed target by ${valJOffByTarget}. valK=${valK} missed target by ${valKOffByTarget}.`);
            if (sumJK < target) { idxJ++; } // if the sum is too small try the next biggest number
            else if (sumJK > target) {
                // if valJ is closer to the target than valK 
                // check the midway point between idxJ & idxK
                // repeats recursively with midIdx as idxK
                // return the last possible midIdx-1 where midIdx is not between j & k AND midVal is not too small
                if (Math.abs(valJOffByTarget) < Math.abs(valKOffByTarget)) {
                    let nextIdxK = (function fn(highIdx) {
                        const midIdx = Math.round((highIdx - idxJ) / 2) + idxJ;
                        const idxMidIsValid = (midIdx > idxJ && midIdx < highIdx);
                        const sumMidIsTooSmall = (nums[midIdx] + nums[idxJ]) <= target;
                        // console.log({
                        //     nums, 
                        //     idx:{j:idxJ,k:idxK, high:highIdx,mid:midIdx},
                        //     vals:{j:nums[idxJ],k:nums[idxJ],high:nums[highIdx],mid:nums[midIdx], target},
                        //     idxMidIsValid, sumMidIsTooSmall
                        // });
                        if (sumMidIsTooSmall || !idxMidIsValid) {
                            return highIdx - 1;
                        }
                        return fn(midIdx);
                    })(idxK);
                    idxK = nextIdxK;
                }
                else {
                    idxK--;
                }
            }
        }
    }
    log.vBullet(`There were ${targetsMissed} incorrect sum(nums[j,k])===target checks made`);
    //TODO change this to a map where key:"[valJ,valK]" & value: "[idxJ,idxK]"; 
    const iterator1 = twoSumMap.entries();

    let uniqueDuoIdxs = [];
    for (const entry of iterator1) {
        const [valJ, valK] = JSON.parse(entry[0]);
        const [idxJ, idxK] = JSON.parse(entry[1]);
        // const [valJ,valK] = [nums[idxJ], nums[idxK]];
        log.vBullet(`Validated Duo [${valJ},${valK}] in [${nums.length < 10 ? nums : "nums"}] for [j,k]=[${idxJ},${idxK}]`);
        uniqueDuoIdxs.push([idxJ, idxK]);
    }
    return uniqueDuoIdxs;
};

module.exports = { threeSum };

function getLogFns() {
    var writeToConsoleLog = (line, arg) => {
        if (true) {
            if (arg)
                console.log(line, arg);


            else
                console.log(line);
        }
    };
    var writeToVerboseLog = (line, arg) => {
        if (isVerbose && !headAndFootOnly) {
            writeToConsoleLog(CHAR_INDENT.repeat(logIndent) + line, arg);
        }
    };
    var writeToVerboseBullet = (line, arg) => {
        if (isVerbose && !headAndFootOnly) {
            const STRING_BULLET_PREFIX = `- `;
            writeToVerboseLog(STRING_BULLET_PREFIX + line, arg);
        }
    };
    var writeHeaderLog = (line, arg) => {
        if (isVerbose) {
            writeToConsoleLog(CHAR_INDENT.repeat(logIndent) + line, arg);
            logIndent++;
        }
    };
    var writeFooterLog = (line, arg) => {
        if (isVerbose) {
            logIndent--;
            writeToConsoleLog(CHAR_INDENT.repeat(logIndent) + line, arg);
        }
    };
    var writeToDebugLog = (line, arg) => {
        if (isDebug) {
            writeToConsoleLog(line, arg);
        }
    };
    return { 
        vHeader: writeHeaderLog, 
        vBullet: writeToVerboseBullet, 
        vFooter: writeFooterLog, 
        verbose: writeToVerboseLog,
        console: writeToConsoleLog,
        debug: writeToDebugLog
    };
}
