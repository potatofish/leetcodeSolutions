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

/**
 * Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] 
 * such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
 * Notice that the solution set must not contain duplicate triplets.
 * @param {number[]} nums
 * @return {number[][]}
 */
const SET_TARGET = 0;
const SET_SIZE = 3;
var threeSum = function(aNumsArray) {
    return threeSumTarget(aNumsArray,SET_TARGET);
}

var threeSumTarget = function(aNumsArray,target) {
    const emptyResult = [];

    // EARLY EXIT: return if array isn't big enough to form a triplet
    if(aNumsArray.length < SET_SIZE) 
        return emptyResult;


    // copy the array so we don't damage the original
    let nums = [...aNumsArray];
    
    //sort the array
    debugTimeStamps.sort = Date.now();
    nums.sort((a,b)=>{ return Math.sign(a - b) }); 
    const sortRuntime = Date.now() - debugTimeStamps.sort;
    writeToVerboseLog(`Sorted nums Array of size ${nums.length} in ${sortRuntime}ms`);

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
    writeToVerboseLog(`Filtered nums Array of size ${nums.length} down to ${filteredNums.length} in ${filterRuntime}ms by removing excess duplicates`);
    nums=filteredNums;
    
    let idxI = 0;
    let idxOflastPossibleK = nums.length - 1;
    let tripletArray = [];
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

        let matchingDuos = twoSumAll(numsSliced, targetSumJK)

        writeToVerboseLog(`New target=${targetSumJK} for sum(nums[j,k]) /w i=${idxI}.`);
        writeToVerboseLog(`Current val=${valI} exists for ${numCounts[valI]} values of i`);
        writeToVerboseLog(`Value @ first possible j=${valOfFirstPossibleJ} & @ last possible k=${valOfLastPossibleK}`)
        writeToVerboseLog(`Sliced ${nums.length} nums down to ${numsSliced} for & found [${matchingDuos.length}] duos`);
        matchingDuos.forEach(idxMatch => {
            const idxJ = idxMatch[0] + idxI + 1;
            const idxK = idxMatch[1] + idxI + 1;
            writeToVerboseLog(`Valid Triplet [${nums[idxI]},${nums[idxJ]},${nums[idxK]}] in [${nums}] for [i,j,k]=[${idxI},${idxJ},${idxK}]`)
        });

        //TODO FAST-FORWARD idxI past any duplicate nums[idxI] values;
        idxI += numCounts[valI];
    }

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
        if(val > SET_TARGET) {
            return true; // we're done with .some() if there aren't enough nums left to form a duo
        }
        checkedVals.add(val);
        writeToDebugLog(`\tLooking for duos for "${val}" @ idx="${idxI}"`)
        const starttwoSumAllTS = Date.now(); 

        var matchingDuos = twoSumAll(restOfNums,SET_TARGET-val,nums);
        const twoSumAllRunTime = Date.now()-starttwoSumAllTS;
        if(twoSumAllRunTime >= 5) {
            console.log(`Lookup length ${twoSumAllRunTime}ms exceeds expectation`);
        }
        if(twoSumAllRunTime >= 0 && matchingDuos.length === 0) {
            const smallestRemSum = nums[idxI] + nums[idxI+1];
            writeToDebugLog(
                `twoSumAll @ idx ${idxI} runtime:${twoSumAllRunTime} ms `+
                `for ${matchingDuos.length} duos, ` + 
                `/w that sum to ${SET_TARGET-val} ` +
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

var twoSumAllNew = (numsJ,duoTarget) => {
    // assumes sorted array
    var findInSortedArray = (numsK,unoTarget) => {
       return numsK.indexOf(unoTarget);
    }

    numsK.some((val,idxJ) => {
        findInSortedArray(numsJ.slice(idxJ),duoTarget-val);
    })
}

var testCases = [
    { input: [-1,0,1,2,-1,-4], expected:[[-1,-1,2],[-1,0,1]] },
    { input: [], expected:[] },
    { input: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1], 
        expected:[[-1,0,1],[0,0,0]] },
    { input: [0], expected:[] }
];

testCases.some((valTC)=>{
    writeHeaderLog(`***threeSum search [target=${SET_TARGET}] for an array nums of size ${valTC.input.length} [START]`);
    debugTimeStamps.threeSum = Date.now(); 
    var results = threeSum(valTC.input);
    const threeSumRuntime = Date.now() - debugTimeStamps.threeSum;
    writeFooterLog(`***threeSum search [target=${SET_TARGET}] for an array nums of size ${valTC.input.length} [COMPLETE in ${threeSumRuntime}ms]`)
    
    if (valTC.expected.length !== results.length) {
        console.log(`Error ${valTC.expected} !== ${results}`);
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
