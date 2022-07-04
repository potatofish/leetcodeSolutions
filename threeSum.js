
class DuoSet extends Set {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getName() {
        return this.name;

    }
}

const isDebug = false;
const isVerbose = true;
const CHAR_INDENT = "\t";
var logIndent = 0;

var writeToConsoleLog = (line,arg) => {
    if(true) {
        if(arg)
            console.log(line,arg);
        else
            console.log(line);
    }
};

var writeToVerboseLog = (line,arg) => {
    if(isVerbose) {
        writeToConsoleLog(CHAR_INDENT.repeat(logIndent)+line,arg);
    }
}

var writeToVerboseBullet = (line, arg) => {
    if(isVerbose) {
        const STRING_BULLET_PREFIX = `- `;
        writeToVerboseLog(STRING_BULLET_PREFIX+line,arg);
    }
}

var writeHeaderLog = (line,arg) => {
    if(isVerbose) {
        writeToConsoleLog(CHAR_INDENT.repeat(logIndent)+line,arg);
        logIndent++;
    }
}

var writeFooterLog = (line,arg) => {
    if(isVerbose) {
        logIndent--;
        writeToConsoleLog(CHAR_INDENT.repeat(logIndent)+line,arg);
    }
}

var writeToDebugLog = (line,arg) => {
    if(isDebug) {
        writeToConsoleLog(line,arg);
    }
};

var debugTimeStamps = {}

// TODO make a different version that finds all twosomes and then pairs them with a third

/**
 * Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] 
 * such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
 * Notice that the solution set must not contain duplicate triplets.
 * @param {number[]} nums
 * @return {number[][]}
 */

var threeSum = function(aNumsArray) {
    const SET_TARGET = 0;
    writeHeaderLog(`*** [START] threeSums search [target=${SET_TARGET}] for an array nums of size ${aNumsArray.length}`);
    debugTimeStamps.threeSum = Date.now(); 
    var matchingThreeSums = threeSums(aNumsArray,SET_TARGET);
    const threeSumRuntime = Date.now() - debugTimeStamps.threeSum;
    writeFooterLog(`*** [COMPLETE in ${threeSumRuntime}ms] threeSums search [target=${SET_TARGET}] for an array nums of size ${aNumsArray.length}`)
    return matchingThreeSums;
}

var threeSums = function(aNumsArray,target) {
    const emptyResult = [];
    const SET_SIZE = 3;
    // EARLY EXIT: return if array isn't big enough to form a triplet
    if(aNumsArray.length < SET_SIZE) 
        return emptyResult;


    // copy the array so we don't damage the original
    let nums = [...aNumsArray];
    
    //sort the array
    debugTimeStamps.sort = Date.now();
    nums.sort((a,b)=>{ return Math.sign(a - b) }); 
    const sortRuntime = Date.now() - debugTimeStamps.sort;
    writeToVerboseBullet(`Sorted nums Array of size ${nums.length} in ${sortRuntime}ms`);

    // EARLY EXIT: return if target is lower than all remaining numbers)
    if (target < nums[0])
        return emptyResult;
    
    // filter array removing numbers from nums for volumes of any individual
    // number greater than the size of the unique set we're trying to produce
    // e.g. in "threeSum([i,j,k,l])" where i=j=k=l
    //      as i,j,k = 1,2,3 results in a set of [3,3,3] 
    debugTimeStamps.filter = Date.now();
    let numCounts = {};
    let filteredNums = nums.filter((val,idx)=>{
        if(typeof numCounts[val] === "undefined") {
            numCounts[val] = 0;
        }
        if(numCounts[val] < SET_SIZE) {
            numCounts[val]++;
            return true;
        }
    });
    const filterRuntime = Date.now() - debugTimeStamps.filter;
    writeToVerboseBullet(`Filtered nums Array of size ${nums.length} down to ${filteredNums.length} in ${filterRuntime}ms by removing excess duplicates`);
    nums=filteredNums;
    
    let idxI = 0;
    let idxOflastPossibleK = nums.length - 1;
    let uniqueTrioIdxs = [];
    let uniqueTrioVals = [];
    while (idxI < nums.length) {
        const valI = nums[idxI];
        const targetSumJK = target - valI;
        const valOfFirstPossibleJ = nums[idxI+1];
        const valOfLastPossibleK = nums[idxOflastPossibleK];
        // EARLY EXIT: return if target is lower than all remaining numbers)
        if (targetSumJK < valOfFirstPossibleJ)
            break;
        
        const numsSliced = nums.slice(idxI+1,idxOflastPossibleK+1)
        // EARLY EXIT: return if array isn't big enough to form a triplet
        if(numsSliced.length < SET_SIZE) 
            break;
            
        writeToVerboseLog(`New target=${targetSumJK} for sum(nums[j,k]) /w i=${idxI}.`);
        writeHeaderLog(`+++ [START] twoSums search target=${targetSumJK} /w idxI=${idxI} in for ${numsSliced.length} nums`);
        debugTimeStamps.twoSums = Date.now();
        let matchingDuos = twoSums(numsSliced, targetSumJK)
        const twoSumsRuntime = Date.now() - debugTimeStamps.twoSums;
        writeFooterLog(`+++ [COMPLETE in ${twoSumsRuntime}ms] twoSums search target=${targetSumJK} results in ${matchingDuos.length} duos`);
        
        writeToVerboseBullet(`Value @ first possible j=${valOfFirstPossibleJ} & @ last possible k=${valOfLastPossibleK}`)
        writeToVerboseBullet(`Sliced ${nums.length} nums down to ${numsSliced} for & found [${matchingDuos.length}] duos`);

        matchingDuos.forEach(idxMatch => {
            const idxJ = idxMatch[0] + idxI + 1;
            const idxK = idxMatch[1] + idxI + 1;
            const [valI,valJ,valK] = [nums[idxI], nums[idxJ],nums[idxK]];
            uniqueTrioIdxs.push([idxI, idxJ, idxK]);
            uniqueTrioVals.push([valI, valJ, valK]);

            writeToVerboseBullet(`Validated Triplet [${valI},${valJ},${valK}] in [${nums}] for [i,j,k]=[${idxI},${idxJ},${idxK}]`)
        });
        
        //FAST-FORWARD idxI past any duplicate nums[idxI] values;
        writeToVerboseBullet(`Current val=${valI} exists for ${numCounts[valI]} values of i`);
        idxI += numCounts[valI];
    }
    return uniqueTrioVals;

    var triosSet = new Set();
    var checkedVals = new Set();
    // var numCounts = {};    
    nums.some((val,idxI) => {
        // var restOfNums = nums.slice(idxI+1);
        const smallestRemSum = (nums[idxI]+nums[idxI+1]);
        var highestPossibleIndex = nums.length - 1;
        var highestPossibleValue = nums[highestPossibleIndex];
        if(highestPossibleValue > (smallestRemSum*-1)) {
            nums.some((val,idx)=>{
                const isValLarger = val > (smallestRemSum*-1);
                if(isValLarger) {
                    highestPossibleIdx = idx-1;
                    return true;
                }
            })
        }
        
        const restOfNums = nums.slice(idxI+1,highestPossibleIndex+1);
        // const filteredNums = restOfNums.filter((val,idx)=>{
        //     const isValLarger = val > (smallestRemSum*-1)
        //     if(isValLarger) {
        //         // console.log(`${val} > ${smallestRemSum*-1} <- (${nums[idxI]} + ${nums[idxI+1]})*-1 @ idx:${idx}`);
        //         return false;
        //     }
        //     return true;
        // });
        
        if(restOfNums.length < 2) {
            return true; // we're done with .some() if there aren't enough nums left to form a duo
        }
        // we're done with current loop of .some() if we've already checked this value as all matching duos
        // would be duplicates of previous loops
        if(checkedVals.has(val)) {
            return false; 
        }
        if(val > target) {
            return true; // we're done with .some() if there aren't enough nums left to form a duo
        }
        checkedVals.add(val);
        writeToDebugLog(`\tLooking for duos for "${val}" @ idx="${idxI}"`)
        const starttwoSumAllTS = Date.now(); 

        var matchingDuos = twoSumAll(restOfNums,target-val,nums);
        const twoSumAllRunTime = Date.now()-starttwoSumAllTS;
        if(twoSumAllRunTime >= 5) {
            console.log(`Lookup length ${twoSumAllRunTime}ms exceeds expectation`);
        }
        if(twoSumAllRunTime >= 0 && matchingDuos.length === 0) {
            const smallestRemSum = nums[idxI] + nums[idxI+1];
            writeToDebugLog(
                `twoSumAll @ idx ${idxI} runtime:${twoSumAllRunTime} ms `+
                `for ${matchingDuos.length} duos, ` + 
                `/w that sum to ${target-val} ` +
                `in nums where ${nums[idxI+1]} <= nums[j,k] <= ${nums[nums.length-1]}` +
                `\nsmallestRemSum in trio array is ${smallestRemSum}`
            );

            //writeToConsoleLog(JSON.stringify(results));
        }

        if(matchingDuos.length > 0) {
            matchingDuos.some((aDuo)=>{
                var idxJ = aDuo[0] + idxI + 1;
                var idxK = aDuo[1] + idxI + 1;
                var trio = [nums[idxI], nums[idxJ], nums[idxK]];
                triosSet.add(JSON.stringify(trio));
                var keys = [idxI, idxJ, idxK]
                writeToDebugLog(`\tMatching duo indexes=[${keys}] returns trio=[${trio}]`)
            })
         }
        else {
            writeToConsoleLog
        }
    });
    
    var results = [];
    triosSet.forEach((value) => {
        var array = JSON.parse(value);
        results.push(array);
    });
    writeToDebugLog(`\tThere are ${results.length} resulting trios. They are `);
    writeToDebugLog("\t\t",results)
    // const  debugTimeStamps.f = Date.now()-startThreeSumTS;
    // writeFooterLog(`***threeSum search [target=${SET_TARGET}] for an array nums of size ${aNumsArray.length} [COMPLETE in ${threeSumRunTime}ms]`)
    // writeToConsoleLog(`threeSum runtime: ${threeSumRunTime} ms`)
    return results;
};

var twoSumAll = (nums,target) => {
    // const starttwoSumAllTS = Date.now(); 
    const MARGIN = "\t";
    var messageStack = [];
    writeToDebugLog(`${MARGIN}+++duo search [target=${target} in for ${nums.length} nums [START]`);
    writeToDebugLog(nums);
    var duoSet = new Set();
    var fwdReadIdx = 0;
    var bkwdReadIdx = nums.length - 1;
    var checkedVals = new Set();
    // const smallestKTarget = nums[0] + target;
    // writeToConsoleLog(`\t smallestKTarget in duo array is ${smallestKTarget}`)
    
    // TODO change the logic so that it works more like threeSum
    // pick a starting index-J, and then search fwd and backward for K
    if(nums.length < 1) {
        return []; // we're done with twoSumAll if there aren't enough nums left to form a duo
    }
    
    while(fwdReadIdx < bkwdReadIdx) {
        checkedVals.add(nums[fwdReadIdx]);
        var sum = nums[fwdReadIdx] + nums[bkwdReadIdx];
        var isMatch = Math.sign(target - sum);
        const IS_SMALLER = -1;
        const IS_BIGGER = 1;
        if(isDebug) {
            if(isMatch === 0) {
                writeToDebugLog(
                    `${MARGIN}\tDuo [${nums[fwdReadIdx]},${nums[bkwdReadIdx]}] (nums[${fwdReadIdx},${bkwdReadIdx}]) ` +
                    `sums to ${sum}. Sum hits target? ${isMatch === 0} `
                )
            }
            else {
                const message = 
                    `noMatch @ idx[j,k]: [${fwdReadIdx}, ${bkwdReadIdx}]`+
                    `values [${nums[fwdReadIdx]}, ${nums[bkwdReadIdx]}] `+
                    `do not sum to ${target} ` +
                    `in nums where ${nums[fwdReadIdx+1]} <= nums[k] <= ${nums[bkwdReadIdx-1]}`;
                messageStack.push(message);
            }
        }

        
        switch(isMatch) {
            case (IS_BIGGER || checkedVals.has(nums[fwdReadIdx])):
                fwdReadIdx++; break;
            case (IS_SMALLER):
                bkwdReadIdx--; break;
            default: 
                writeToDebugLog(JSON.stringify([fwdReadIdx,bkwdReadIdx]))
                duoSet.add(JSON.stringify([fwdReadIdx,bkwdReadIdx]));
                // reset indexes, shifting fwdRead forward one
                bkwdReadIdx = nums.length - 1;
                fwdReadIdx++;
        }
    }
    var results = [];
    duoSet.forEach((value) => {
        const duoIdxPair = JSON.parse(value);
        results.push(duoIdxPair);
    });
    if(results.length === 0 && isDebug) {
        messageStack.some((msg)=>{writeToDebugLog(msg);})
    }
    writeToDebugLog(`${MARGIN}\tThere are ${results.length} resulting duos. They are `);
    writeToDebugLog(MARGIN+"\t\t",results)
    writeToDebugLog(`${MARGIN}+++duo search [target=${target} in nums=[${nums}]] complete`)
    // const twoSumAllRunTime = Date.now()-starttwoSumAllTS;
    // if(twoSumAllRunTime > 0 && results.length === 0) {
    //     writeToConsoleLog(`twoSumAll runtime: ${twoSumAllRunTime} ms for ${results.length} results, target=${target}`)
    //     //writeToConsoleLog(JSON.stringify(results));
    // }
    return results;
}

var twoSums = (aNumsArray,target) => {
    const emptyResult = [];
    const SET_SIZE = 2;
    // EARLY EXIT: return if array isn't big enough to form a duo
    if(aNumsArray.length < SET_SIZE) 
        return emptyResult;

    let nums = [...aNumsArray];
    // EARLY EXIT: return if target is lower than all remaining numbers)
    if (target < nums[0])
        return emptyResult;
    
    let idxJ = 0;
    let idxK = aNumsArray.length-1;
    let numsAreParsed = false;
    let twoSumMap = new Map();
    let targetsMissed = 0;
    while(idxJ < idxK) {
        const valJ = nums[idxJ];
        const valK = nums[idxK];
        const sumJK = valJ+valK;
        const sumOffByTarget = target - sumJK;
        const valJOffByTarget = target - valJ; 
        const valKOffByTarget = target - valK; 
        const sumOffsetSign = Math.sign(sumOffByTarget)
        writeToVerboseBullet(`Target=${target} ${sumOffByTarget === 0 ? "hit": "missed by " + sumOffByTarget} for sum(nums[j,k])=${sumJK} /w [j,k]=[${idxJ},${idxK}].`);
        if(sumOffByTarget === 0) {
            twoSumMap.set(JSON.stringify([valJ,valK]),JSON.stringify([idxJ,idxK]));
            // reset indexes, shifting fwdRead forward one
            idxK = nums.length - 1;
            idxJ++;
        }
        else{
            targetsMissed++;
            writeToVerboseLog(`  valJ=${valJ} missed target by ${valJOffByTarget}. valK=${valK} missed target by ${valKOffByTarget}.`);
            if(sumJK < target) { idxJ++; }  // if the sum is too small try the next biggest number
            else if(sumJK > target) { 
                // if valJ is closer to the target than valK 
                // check the midway point between idxJ & idxK
                // repeats recursively with midIdx as idxK
                // return the last possible midIdx-1 where midIdx is not between j & k AND midVal is not too small
                if(Math.abs(valJOffByTarget) < Math.abs(valKOffByTarget)){
                    let nextIdxK = (function fn(highIdx) {
                        const midIdx = Math.round((highIdx - idxJ)/2)+idxJ;
                        const idxMidIsValid = (midIdx > idxJ && midIdx < highIdx);
                        const sumMidIsTooSmall = (nums[midIdx] + nums[idxJ]) <= target;
                        // console.log({
                        //     nums, 
                        //     idx:{j:idxJ,k:idxK, high:highIdx,mid:midIdx},
                        //     vals:{j:nums[idxJ],k:nums[idxJ],high:nums[highIdx],mid:nums[midIdx], target},
                        //     idxMidIsValid, sumMidIsTooSmall
                        // });
                        if(sumMidIsTooSmall || !idxMidIsValid) {
                            return highIdx-1; 
                        }
                        return fn(midIdx);
                    })(idxK);
                    idxK=nextIdxK;
                  }
                else {
                      idxK--; 
                }
            } 
        }
    }
    writeToVerboseBullet(`There were ${targetsMissed} incorrect sum(nums[j,k])===target checks made`);
    //TODO change this to a map where key:"[valJ,valK]" & value: "[idxJ,idxK]"; 
    const iterator1 = twoSumMap.entries();

    let uniqueDuoIdxs = [];
    for (const entry of iterator1) {
        const [valJ,valK] = JSON.parse(entry[0]);
        const [idxJ,idxK] = JSON.parse(entry[1]);
        // const [valJ,valK] = [nums[idxJ], nums[idxK]];
        writeToVerboseBullet(`Validated Duo [${valJ},${valK}] in [${nums}] for [j,k]=[${idxJ},${idxK}]`)
        uniqueDuoIdxs.push([idxJ,idxK])
    }
    return uniqueDuoIdxs;
}

var findIdxK = (numsK,target) => {
    let idxKMin = 0;
    let idxKMax = numsK.length-1;
    let idxKMid = Math.round(idxKMax/2);
    
    let valOfIdxMin = numsK[idxKMin];
    let valOfIdxMax = numsK[idxKMax]; 
    let valOfIdxMid = numsK[idxKMid]; 
    writeToVerboseLog(`[min,mid,max]=[${idxKMin},${idxKMid},${idxKMax}] -> vals:[${valOfIdxMin},${valOfIdxMid},${valOfIdxMax}]`);
}



var testCases = [
    { input: [-1,0,1,2,-1,-4], expected:[[-1,-1,2],[-1,0,1]] },
    { input: [], expected:[] },
    { input: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], 
        expected:[[-1,0,1],[0,0,0]] },
    { input: [0], expected:[] }
];

testCases.some((valTC)=>{
    var results = threeSum(valTC.input);
    
    const lenExpected = valTC.expected.length;
    const lenActual = results.length;
    if (lenExpected !== lenActual) {
        const largestLength = Math.max(lenExpected, lenActual);
        console.log(`Result Length Error: len(expected,actual) do not match -> ${lenExpected} !== ${lenActual}`);
        // console.log({largestLength});
        for (let index = 0; index < largestLength; index++) {
            const elementExpected = valTC.expected[index];
            const actualExpected = results[index];
            // console.log(`Error ${elementExpected} !== ${actualExpected}`);
            if (elementExpected !== actualExpected)
                console.log(`Error ${elementExpected} !== ${actualExpected}`);
        }
    }
    else {
        results.some((trio,resultIdx)=>{
            trio.some((val,trioIdx)=> {
                if(valTC.expected[resultIdx][trioIdx] !== val) {
                    console.log(`${valTC.expected[resultIdx][trioIdx]} !== ${val}`);
                }
            })
        })
    }
})
