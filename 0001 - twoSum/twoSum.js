/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */



 class DuoCollection {
    constructor(theNumsArray,theTarget) {
        console.log("start",Object.keys(theNumsArray));
        if (!Array.isArray(theNumsArray))
            throw "Nums provided is not an array to build collection from";
        this.nums = theNumsArray.sort((a, b) => { return Math.sign(a - b); });
        this.collection = {};
        this.target = theTarget;
        
        let countUnmatchedSums
        
        let [idxJ, idxK] = [0, theNumsArray.length-1];
        while (idxJ< idxK && idxJ !== null) {
            console.log({idxJ,idxK});
            const [valJ, valK] = [idxJ, idxK].map(idx => theNumsArray[idx]);
            const sumJK = valJ + valK;
            const diffOfTargetSumJK = theTarget - sumJK;
            
            let [eeFlag, eeMessage] = checkForEarlyExit();
            if (eeFlag) {
                log.vBullet(eeMessage);
                break;
            }
            
            if (diffOfTargetSumJK === 0) {
                // console.log({this:this});
                this.add([valJ, valK], [idxJ, idxK]);
                log.vBullet(`Add completed, incrementing indicies - ${idxJ}, ${idxK}`)
            }
            incrementIndicies();

                        
            
            function checkForEarlyExit() {
                // EARLY EXIT Maximum possible sum is less than the target, making the sum impossible
                const maxPossibleSum = valK * DuoCollection.entryLength;
                if (maxPossibleSum < theTarget) {
                    const message =
                    `!!!WHILE BREAK:\n` + 
                    CHAR_INDENT.repeat(log.indent()+1) + `Highest valK, makes for a maximum possible twoSum of ${maxPossibleSum} (valK:${valK})\n` + 
                    CHAR_INDENT.repeat(log.indent()+1) + `And that is less than the targetSum for duos (maxSum:${maxPossibleSum} < target:${theTarget})`;
                    return [true,message];
                }
                return [false];
                
            }
            
            function incrementIndicies() {
                // if the sum matches the target, set K back to the end of the array & try nextJ
                if (sumJK === theTarget) {
                    idxJ = getNextIndex(idxJ, idxK,"fforward",theTarget);
                    return;
                }

                countUnmatchedSums++;
                //TODO find out how many times the next biggest nuimber is way off - and if we should split for a new idxJ
                // if the sum is too small try the next biggest number
                if (sumJK < theTarget) { 
                    idxJ = getNextIndex(idxJ, idxK,"fforward",theTarget);
                    return;
                } 
                

                if (sumJK > theTarget) {
                    idxK = getNextIndex(idxJ, idxK,"rewind",theTarget);
                    return;
                }
                
                // if valJ is closer to the target than valK check the midway point between idxJ & idxK
                // repeating recursively with midIdx as idxK or idxJ ending when either
                //  -there are no more midways points (returns idxLow to push idxJ lower than idxK & end the loop)
                // - there is a 
                function getNextIndex(idxLow,idxHigh,mode, targetNumber) {
                    var valAtMid = (valLow,valMid,valHigh)=>{
                        return valMid;
                    }; 
                    
                    return getNextIndexRec(idxLow,idxHigh,mode)
                    
                    function getNextIndexRec(r_idxLow,r_idxHigh,r_mode) {
                        var sumAtMid = (valLow,valMid,valHigh)=>{
                            return valMid + (r_mode === "rewind" ? valLow : valHigh);
                        };
                        const r_idxMid = Math.round((r_idxHigh - r_idxLow) / 2) + r_idxLow;
                        const [valLow, valMid, valHigh] = [r_idxHigh,r_idxMid,r_idxLow].map((idx)=>{return theNumsArray[idx]});
                        const idxMidIsValid = (r_idxLow < r_idxMid && r_idxMid < r_idxHigh);
                        const getValueToCompare = ((mode === "find") ? valAtMid : sumAtMid);
                        // console.log({getValueToCompare});
                        const resultToCompare = getValueToCompare(valLow, valMid, valHigh);
                        
                        if(!idxMidIsValid) { return null; }
                        if(resultToCompare === targetNumber) { return r_idxMid; }
                        
                        // log.vBullet(`idxs{high:${r_idxHigh},low:${r_idxLow}, mid:${r_idxMid}},\n`+
                        //     CHAR_INDENT.repeat(log.indent()) + `  vals{high:${valHigh},low:${valLow}, mid:${valMid}},\n`+
                        //     CHAR_INDENT.repeat(log.indent()) + `  sums{target:${targetNumber},@mid:${sumAtMid}, max:${valHigh*2},max@mid:${valMid*2}},\n` +
                        //     CHAR_INDENT.repeat(log.indent()) + `  flags{tooSmall:${sumAtMid < targetNumber},isValid:${idxMidIsValid}\n` +
                        //     CHAR_INDENT.repeat(log.indent()) + `  nums{len:${theNumsArray.length},newLen:${theNumsArray.slice(0, idxHigh).length}}`
                        // );
                        if(resultToCompare < targetNumber) {
                            let newIdx = getNextIndexRec(r_idxMid, idxHigh,"fforward");
                            return newIdx; 
                        }
                        
                        // IMPLIED if(resultToCompare > targetNumber)
                        let newIdx = getNextIndexRec(r_idxLow, r_idxMid,"rewind");
                        return newIdx;
                        
                    }
                }
                
            }
        }
        // console.log({this:this});
        this.add = undefined;
        delete this.add;
        
        
    }
    
    
    add(pairOfNums,pairOfIdxs) {
        if (this.has(pairOfNums)) {
            log.vBullet(`!!!REJECTION - Has Pair - Trying to add [${pairOfNums}],[${pairOfIdxs}]`);
            return;
        }
        let aNewDuo = {}
        aNewDuo[pairOfNums] =pairOfIdxs;
        console.log({aNewDuo});
        Object.assign(this.collection,aNewDuo)
        return aNewDuo
    }

    get(pairOfNums) {
        isPairOfNums(pairOfNums);
        return this.collection[pairOfNums];
    }

    has(pairOfNums) {
        isPairOfNums(pairOfNums);
        let duoFromCollection = this.get(pairOfNums);
        return (duoFromCollection ? duoFromCollection : false);
    }

    set() {
        return this.add(key,value);
    }

    toString() {
        return [];
    }
}
DuoCollection.entryLength = 2;

function isPairOfNums(pairOfNums) {
    if (!Array.isArray(pairOfNums))
        throw "Duo must be an Array";
    if (pairOfNums.length != 2)
        throw `Duo [${pairOfNums},len:${pairOfNums.length}] must have two elements`;
}

 var twoSumV1 = function(nums, target) {
    var set = new Set();
    
    for(var idx = 0; idx < nums.length; idx++) {
        var val = nums[idx];
        var newTarget = target - val;
        var newTargetArrayIndex = nums.slice(idx+1).indexOf(newTarget)
        // console.log({val,idx,target,newTarget,newTargetArrayIndex})
        if(newTargetArrayIndex != -1) {
            return [idx,newTargetArrayIndex+idx+1]
        } 
    }
    
    return null;
};

var twoSumV2 = function(nums, target) {
    const emptyResult = [];
    if(Array.isArray(nums) === false || 
       typeof target === "undefined") {
        return emptyResult;
    }

    const numsClone = [...nums]
    var numsProcessed = 0;
    while(numsClone.length > 0) {
        const val = numsClone.shift();
        const newTarget = target - val;
        const newTargetArrayIndex = numsClone.indexOf(newTarget)
        console.log({val, newTarget,target, newTargetArrayIndex});
        if(newTargetArrayIndex != -1) {
            return [numsProcessed,newTargetArrayIndex+numsProcessed+1]
        } 
        numsProcessed++;
    }
    console.log({numsProcessed});
    
    return null;
};



var twoSum= (nums,target) => {
    console.log({nums,target});
    return twoSumV2(nums,target);
}

var twoSumAll = (nums, target) => {
    console.log({nums},{target});
    const collection = new DuoCollection(nums, target);
    return collection.toString();
}

module.exports = { twoSum, twoSumAll };