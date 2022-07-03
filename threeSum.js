const isDebug = false;

var writeToConsoleLog = (line,arg) => {
    if(true) {
        if(arg)
            console.log(line,arg);
        else
            console.log(line);
    }
};

var writeToDebugLog = (line,arg) => {
    if(isDebug) {
        writeToConsoleLog(line,arg);
    }
};

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(aNumsArray) {
    var nums = [...aNumsArray];
    const startThreeSumTS = Date.now(); 
    const SET_TARGET = 0;
    writeToDebugLog(`***trios search [target=${SET_TARGET}] start for ${nums.length} nums:`)
    //sort the array
    nums.sort((a,b)=>{
        return Math.sign(a - b)
    }); 
    
    const startFilterTS = Date.now();
    var filterCounts = {};
    // const smallestSum = nums[0] + nums[1];
    // writeToConsoleLog(`\t smallestSum in trio array is ${smallestSum}`)
    var filteredNums = nums.filter((val,idx)=>{
        // if(val <= smallestSum*-1) {
            if(typeof filterCounts[val] === "undefined") {
                filterCounts[val] = 0;
            }
            if(filterCounts[val] < 3) {
                filterCounts[val]++;
                return true;
            }
        // }
    });
    const endFilterTS = Date.now();
    const delayMS = endFilterTS - startFilterTS;
    // writeToDebugLog(filteredNums)
    // nums=filteredNums;

    writeToConsoleLog(`\tfiltering delay:${delayMS}ms`)
    // if(nums.length !== filteredNums.length && delayMS > 1)
    //     throw `delay ${delayMS}ms\n\t[${nums}]\n\t[${filteredNums}]`

    var triosSet = new Set();
    var checkedVals = new Set();
    var filterCounts = {};    
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
    writeToDebugLog(`***trios search [target=${SET_TARGET} in nums=[${nums}]] complete`)
    const threeSumRunTime = Date.now()-startThreeSumTS;
    writeToConsoleLog(`threeSum runtime: ${threeSumRunTime} ms`)
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