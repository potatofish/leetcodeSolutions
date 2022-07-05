// const MODE_STATE
const PATH_DEV_ENV_HOME_DIR = "/home/fishy/";
const CHAR_INDENT = "\t";


const IS = {
    "VERBOSE": true,
    "DEBUG": false,
    "HEADER_FOOTER": false,
    "OUTPUT_CATCH": false
}
const MAX_PRINTABLE_NUMS_LEN = 10;

const isDevelopment = process.execPath.split(PATH_DEV_ENV_HOME_DIR).length > 1;
const verbosePrintingOn = isDevelopment && IS.VERBOSE;

let logIndent = 0;
const log = getLogFns();


let verboseTimeStamps = {};
let timeStampWrap = ((label,message,evalFn, logFnBefore, logFnAfter) => {
    if(!verbosePrintingOn) {
        return evalFn();
    }
    
    logFnBefore = typeof logFnBefore === "undefined" ? log.vBullet : logFnBefore;
    verboseTimeStamps[label]= []; 
    verboseTimeStamps[label].start = Date.now();
    if(typeof logFnAfter !== "undefined") {
        let wrapZone = "TS-START";
        logFnBefore(`${eval(message)}`);
    }

    let tsResult = evalFn();

    let wrapZone = "TS-FINAL";
    let afterArg = message;
    verboseTimeStamps[label].end = Date.now()
    verboseTimeStamps[label].runtime = ()=>{return verboseTimeStamps[label].end - verboseTimeStamps[label].start;}
    if(typeof logFnAfter === "undefined") {
        logFnAfter = logFnBefore;
        afterArg += `+ \`in ${verboseTimeStamps[label].runtime()}ms\``;
    }
    else {
        wrapZone += ` in ${verboseTimeStamps[label].runtime()}ms`;
    }

    logFnAfter(`${eval(afterArg)}`);

    return tsResult;
});

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

    verboseTimeStamps.threeSum = Date.now();
    var matchingThreeSums = threeSums(aNumsArray, SET_TARGET);
    if(IS.OUTPUT_CATCH) {
        log.vBullet((()=>{
            let outputString = "";
            matchingThreeSums.forEach((val)=>{outputString += `[${val}],`;});
            return outputString;
        })())
    }
    const threeSumRuntime = Date.now() - verboseTimeStamps.threeSum;
    log.vFooter(`*** [COMPLETE in ${threeSumRuntime}ms] threeSums search [target=${SET_TARGET}] for an array nums of size ${aNumsArray.length}`);
    return matchingThreeSums;
};

var threeSums = function (aNumsArray, target) {
    const EMPTY_RESULT = [];
    const LEN_TRIPLET = 3;
    // EARLY EXIT: return if array isn't big enough to form a triplet
    if (aNumsArray.length < LEN_TRIPLET) {
        log.vBullet(`EARLY EMPTY EXIT: a nums of size ${aNumsArray.length} is not enough to form a triplet`);
        return EMPTY_RESULT;
    }

    // copy the array so we don't damage the original
    let nums = [...aNumsArray];

    //sort the array
    const sort = () => {
        return nums.sort((a, b) => { return Math.sign(a - b); });
    };
    const sortedNums = timeStampWrap("sort", "`"+ `Sorted nums Array of size ${nums.length}` + "`", sort);

    // EARLY EXIT: return if target is lower than all remaining numbers)
    if (target < nums[0]) {
        log.vBullet(`EARLY EMPTY EXIT: Target (${target}) is lower than the smallest value in nums - ${nums[0]}`);
        return EMPTY_RESULT;
    }

    // EARLY EXIT Maximum possible sum is less than the target, making the sum impossible
    const lastIndex = nums.length - 1;
    const lastHighValue = nums[lastIndex];
    const maxPossibleSum = lastHighValue * LEN_TRIPLET;
    if (maxPossibleSum < target) {
        log.vBullet(
            `!!!EARLY EXIT:\n` + 
            CHAR_INDENT.repeat(log.indent()+1) + `Highest valK, makes for a maximum possible threeSum of ${maxPossibleSum} (valK:${lastHighValue})\n` + 
            CHAR_INDENT.repeat(log.indent()+1) + `And that is less than the targetSum for triplets (maxSum:${maxPossibleSum} < target:${target})`
        );
        return EMPTY_RESULT;
    }

    // filter array removing numbers from nums for volumes of any individual
    // number greater than the size of the unique set we're trying to produce
    // e.g. in "threeSum([i,j,k,l])" where i=j=k=l
    //      as i,j,k = 1,2,3 results in a set of [3,3,3] 
    let numCounts = {};
    const filterExcessDuplicates = () => {
        return nums.filter((val) => {
            if (typeof numCounts[val] === "undefined") {
                numCounts[val] = 0;
            }
            if (numCounts[val] < LEN_TRIPLET) {
                numCounts[val]++;
                return true;
            }
        });
    };
    const filteredNums = timeStampWrap("filter", "`"+ `Filtered nums Array of size ${nums.length}` + " down to ${tsResult.length}`", filterExcessDuplicates);
    nums = filteredNums;

    let idxI = 0;
    const idxOflastPossibleK = nums.length - 1;
    let [idxOfnewLastK] = sliceSortedRange(idxOflastPossibleK,idxI,target,nums);

    //TODO SPLIT K BY MIDPT FROM THE END LIKE WE DID IN TWOSUM
    const uniqueTrioData = {
        "keysArray": [],
        "valuesArray": [],
        add: (keys) => {
            const [idxI, idxJ,idxK] = keys;
            const [valI, valJ, valK] = [nums[idxI], nums[idxJ], nums[idxK]];
            uniqueTrioData.keysArray.push([idxI, idxJ, idxK]);
            uniqueTrioData.valuesArray.push([valI, valJ, valK]);
            return [valI, valJ, valK];
        }
    };
    while (idxI < nums.length) {
        let highestVal = nums[idxOflastPossibleK];
        const firstIdxJ = idxI + 1;
        const nextLowValue = nums[firstIdxJ];
        // const lowValueTarget = target - nextLowValue;
        const valI = nums[idxI];
        const targetSumOfJK = target - valI;
        // TODO figure out if the following code for trying to reduce the end of the upcoming nums.slice()
        // [idxOfnewLastK] = sliceSortedRange(idxOflastPossibleK,firstIdxJ,targetSumOfJK,nums);
        
        // let twoSumEndIdx = idxOflastPossibleK;
        // if(idxOfnewLastK !== idxOflastPossibleK) {
        //     const newHighestVal = nums[idxOfnewLastK];
        //     twoSumEndIdx=idxOfnewLastK;
        //     highestVal=newHighestVal;
        //     if(nums[idxOfnewLastK]*2 < targetSumOfJK)
        //         console.log("!!!WARNING - ");
        //     log.vBullet(
        //         `for idxI=${idxI} newMaxIdxK !== oldMaxIdxK (${idxOfnewLastK} !== ${idxOflastPossibleK})\n`+
        //         `vals{valI: ${valI}, lowValTarget:${targetSumOfJK},oldValMaxK:${highestVal} ,newValMaxK:${newHighestVal},highestSum:${nums[idxOfnewLastK]*2}}`
        //     );
        // }

        // EARLY EXIT: return if target is lower than all remaining numbers)
        if (targetSumOfJK < nextLowValue) {
            log.vBullet(
                `WHILE BREAK:\n` + 
                CHAR_INDENT.repeat(log.indent()+1) + `Current idxI has no matching duos in the remaining numbers (idxI:${idxI}, valI:${valI})\n` +
                CHAR_INDENT.repeat(log.indent()+1) + `Next smallest valJ is above new target of Sum(valJ,valK) (valJ:${nextLowValue} > target:${targetSumOfJK}),`
            );
            break;
        }

        const numsSliced = nums.slice(firstIdxJ, idxOflastPossibleK + 1);
        // const numsSliced = nums.slice(firstIdxJ, twoSumEndIdx + 1);
        // EARLY EXIT: return if array isn't big enough to form a triplet
        if (numsSliced.length < (LEN_TRIPLET - 1)) {
            log.vBullet(
                `WHILE BREAK:\n` + 
                CHAR_INDENT.repeat(log.indent()+1) + `a numsSliced of size ${numsSliced.length} is not enough to form a duo`
            );
            break;
        }

        // EARLY EXIT Maximum possible sum is less than the target, making the sum impossible
        const maxPossibleSum = highestVal * LEN_TRIPLET;
        if (maxPossibleSum < target) {
            log.vBullet(
                `!!!WHILE BREAK:\n` + 
                CHAR_INDENT.repeat(log.indent()+1) + `Highest valK, makes for a maximum possible threeSum of ${maxPossibleSum} (valK:${highestVal})\n` + 
                CHAR_INDENT.repeat(log.indent()+1) + `And that is less than the targetSum for trios (maxSum:${maxPossibleSum} < target:${target})`
            );
            break;
        }

        log.verbose(`New target=${targetSumOfJK} for sum(nums[j,k]) /w i=${idxI}.`);
        const twoSumsRuntimeMsg = "`+++ [${wrapZone}] " + `twoSums search target=${targetSumOfJK} /w idxI=${idxI} in for ${numsSliced.length} nums` + "`";
        const twoSumsWrapperFn = () => { return twoSums(numsSliced, targetSumOfJK); };
        const matchingDuos = timeStampWrap("twoSums", twoSumsRuntimeMsg, twoSumsWrapperFn, log.vHeader, log.vFooter);

        log.vBullet(`Value @ first possible j=${nextLowValue} & @ last possible k=${highestVal}`);
        log.vBullet(
            `Sliced ${nums.length} nums down to ` +
            `${numsSliced.length < MAX_PRINTABLE_NUMS_LEN ? "["+numsSliced+"]" : numsSliced.length + " integers"} ` +
            `for & found [${matchingDuos.length}] duos`
        );

        matchingDuos.forEach(idxMatch => {
            function offsetDuoIdx(n) {
                return idxMatch[n] + idxI + 1;
            }
            const [idxJ,idxK] = [offsetDuoIdx(0), offsetDuoIdx(1)];
            const [valI, valJ, valK] = uniqueTrioData.add([idxI, idxJ, idxK]);

            log.vBullet(
                `Validated Triplet [${valI},${valJ},${valK}] ` + 
                `${nums.length < MAX_PRINTABLE_NUMS_LEN ? "in ["+nums+"]" : "within " + nums.length + " integers"}` + 
                ` for [i<j<k]=[${idxI}<${idxJ}<${idxK}]`
            );

        });

        //FAST-FORWARD idxI past any duplicate nums[idxI] values;
        log.vBullet(`Current val=${valI} exists for ${numCounts[valI]} values of i`);
        idxI += numCounts[valI];
    }
    return uniqueTrioData.valuesArray;


};

var twoSums = (aNumsArray, target) => {
    const emptyResult = [];
    const LEN_DUO = 2;
    // EARLY EXIT: return if array isn't big enough to form a duo
    if (aNumsArray.length < LEN_DUO)
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

            // EARLY EXIT Maximum possible sum is less than the target, making the sum impossible
            const maxPossibleSum = valK * LEN_DUO;
            if (maxPossibleSum < target) {
                log.vBullet(
                    `!!!WHILE BREAK:\n` + 
                    CHAR_INDENT.repeat(log.indent()+1) + `Highest valK, makes for a maximum possible twoSum of ${maxPossibleSum} (valK:${valK})\n` + 
                    CHAR_INDENT.repeat(log.indent()+1) + `And that is less than the targetSum for duos (maxSum:${maxPossibleSum} < target:${target})`
                );
                break;
            }
    
            // log.verbose(`  valJ=${valJ} missed target by ${valJOffByTarget}. valK=${valK} missed target by ${valKOffByTarget}.`);
            if (sumJK < target) { idxJ++; } // if the sum is too small try the next biggest number
            else if (sumJK > target) {
                // if valJ is closer to the target than valK 
                // check the midway point between idxJ & idxK
                // repeats recursively with midIdx as idxK
                // return the last possible midIdx-1 where midIdx is not between j & k AND midVal is not too small
                if (Math.abs(valJOffByTarget) < Math.abs(valKOffByTarget)) {
                    // let newLastIdx = splitSortedRange(idxK,idxJ,target,nums);
                    // idxK = newLastIdx;
                    [idxK] = sliceSortedRange(idxK,idxJ,target,nums);
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
        log.vBullet(`Validated Duo [${valJ},${valK}] in [${nums.length < MAX_PRINTABLE_NUMS_LEN ? "["+nums+"]" : nums.length + " integers"}] for [j,k]=[${idxJ},${idxK}]`);
        uniqueDuoIdxs.push([idxJ, idxK]);
    }
    return uniqueDuoIdxs;
};

function sliceSortedRange(highIdx,lowIdx,target,sortedNumsArray) {
    const midIdx = Math.round((highIdx - lowIdx) / 2) + lowIdx;
    const [valHigh,valLow, valMid] = [sortedNumsArray[highIdx],sortedNumsArray[lowIdx],sortedNumsArray[midIdx]]
    const idxMidIsValid = (midIdx > lowIdx && midIdx < highIdx);
    const sumMidIsTooSmall = (sortedNumsArray[midIdx] + valLow) <= target;
    // log.vBullet(`idxs{high:${highIdx},low:${lowIdx}, mid:${midIdx}},\n`+
    //     CHAR_INDENT.repeat(log.indent()) + `  vals{high:${valHigh},low:${valLow}, mid:${valMid}},\n`+
    //     CHAR_INDENT.repeat(log.indent()) + `  sums{target:${target},max:${valHigh*2},max@mid:${valMid*2}},\n` +
    //     CHAR_INDENT.repeat(log.indent()) + `  flags{tooSmall:${sumMidIsTooSmall},isValid:${idxMidIsValid}\n` +
    //     CHAR_INDENT.repeat(log.indent()) + `  nums{len:${sortedNumsArray.length},newLen:${sortedNumsArray.slice(0, highIdx).length}}`
    // );

    if (sumMidIsTooSmall || !idxMidIsValid) {
        // const slicedNums = sortedNumsArray.slice(0, highIdx);
        return [highIdx - 1];
    }
    return sliceSortedRange(midIdx,lowIdx,target,sortedNumsArray);
}

function getLogFns() {
    let theLogIndent = 0;
    var writeToConsoleLog = (line, arg) => {
            let logArgs = [line].concat(arg);
            console.log(...logArgs);
            // if (arg)
            //     console.log(line, arg);
            // else
            //     console.log(line);
    };
    var writeToVerboseLog = (line, arg) => {
        if (verbosePrintingOn && !IS.HEADER_FOOTER) {
            writeToConsoleLog(CHAR_INDENT.repeat(theLogIndent) + line, arg);
        }
    };
    var writeToVerboseBullet = (line, arg) => {
        if (verbosePrintingOn && !IS.HEADER_FOOTER) {
            const STRING_BULLET_PREFIX = `- `;
            writeToVerboseLog(STRING_BULLET_PREFIX + line, arg);
        }
    };
    var writeHeaderLog = (line, arg) => {
        if (verbosePrintingOn) {
            // console.log({H_indent: theLogIndent});
            writeToConsoleLog(CHAR_INDENT.repeat(theLogIndent) + line, arg);
            theLogIndent++;
        }
    };
    var writeFooterLog = (line, arg) => {
        if (verbosePrintingOn) {
            theLogIndent--;
            // console.log({F_indent:theLogIndent});
            writeToConsoleLog(CHAR_INDENT.repeat(theLogIndent) + line, arg);
        }
    };
    var writeToDebugLog = (line, arg) => {
        if (IS.DEBUG) {
            writeToConsoleLog(line, arg);
        }
    };
    return { 
        vHeader: writeHeaderLog, 
        vBullet: writeToVerboseBullet, 
        vFooter: writeFooterLog, 
        verbose: writeToVerboseLog,
        // console: writeToConsoleLog,
        debug: writeToDebugLog,
        indent: ()=>{return theLogIndent;}
    };
};

module.exports = { threeSum };