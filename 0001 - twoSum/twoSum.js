/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
 const IS = {
    "VERBOSE": true,
    "DEBUG": false,
    "HEADER_FOOTER": false,
    "OUTPUT_CATCH": false
}
// const MAX_PRINTABLE_NUMS_LEN = 10;
const PATH_DEV_ENV_HOME_DIR = "/home/fishy/";
const CHAR_INDENT = "\t";

const isDevelopment = process.execPath.split(PATH_DEV_ENV_HOME_DIR).length > 1;
const verbosePrintingOn = isDevelopment && IS.VERBOSE;
const log = getLogFns();

 class DuoCollection {
    constructor(theNumsArray,theTarget, maxCollectionSize, theResponseType) {
        log.vHeader(`[START] DuoCollection for ${theNumsArray.length} numbers summing to a target of ${theTarget}`);
        if (!Array.isArray(theNumsArray))
            throw "Nums provided is not an array to build collection from";
        this.nums = [...theNumsArray];
        this.responseType = theResponseType;
        
        // We can mix up the array if we don't care about returning 
        // indicies based on the original order of theNumsArray
        // if ( this.responseType === "values") {
            // }
            
        // TODO Make a map nums to sortedNums indicies so that this can be done w/ type = "indicies"
        // TODO or better - make it so that the map is always made, but only used if indicies are
        // TODO requested out of the exporter
        this.numsSortingMap = this.nums.map((val,idx)=>{
            return {val,idx};
        })
        this.numsSortingMap = this.numsSortingMap.sort((a, b) => { return Math.sign(a.val - b.val); })
        this.sortedNums = this.numsSortingMap.map((element)=>{return element.val});
        let localNums = this.sortedNums; // create a local copy for when 'this' refers to something else
        // log.vBullet(`{numsSortingMap: ${JSON.stringify(this.numsSortingMap)}, localNums: ${localNums}}`);
        log.vBullet(`{nums: ${this.nums}, sortedNums: ${this.sortedNums}}`);
        this.collection = {};
        this.target = theTarget;
        
        let countUnmatchedSums
        
        let [idxJ, idxK] = [0, localNums.length-1];
        // while (idxJ< idxK && idxJ !== null && Object.keys(this.collection).length < maxCollectionSize) {
        while (idxJ< idxK && idxJ !== null) {
            const [valJ, valK] = [idxJ, idxK].map(idx => localNums[idx]);
            log.vBullet(`Checking nums elements at {idxJ,idxK}. vals(${idxJ}, ${idxK}) = [${valJ}, ${valK}]`);
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
                log.vBullet(`Add completed, our collection has grown to a size of ${Object.keys(this.collection).length} number pairs summing to ${this.target}. (Max Pairs: ${maxCollectionSize})`);
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
                    // idxJ = getNextIndex(idxJ, idxK,"fforward",theTarget);
                    idxJ++
                    return;
                }

                countUnmatchedSums++;
                //TODO find out how many times the next biggest nuimber is way off - and if we should split for a new idxJ
                // if the sum is too small try the next biggest number
                if (sumJK < theTarget) { 
                    idxJ = getNextIndex(idxJ, idxK,"fforward",theTarget);
                    // idxJ++
                    return;
                } 
                

                if (sumJK > theTarget) {
                    idxK = getNextIndex(idxJ, idxK,"rewind",theTarget);
                    // idxK--;
                    return;
                }
                
                // if valJ is closer to the target than valK check the midway point between idxJ & idxK
                // repeating recursively with midIdx as idxK or idxJ ending when either
                //  -there are no more midways points (returns idxLow to push idxJ lower than idxK & end the loop)
                // - there is a 
                function getNextIndex(idxLow,idxHigh,mode, targetNumber,sortedArray) {
                    var valAtMid = (valLow,valMid,valHigh)=>{
                        return valMid;
                    }; 
                    
                    return getNextIndexRec(idxLow,idxHigh,mode,sortedArray)
                    
                    function getNextIndexRec(r_idxLow,r_idxHigh,r_mode) {
                        var sumAtMid = (valLow,valMid,valHigh)=>{
                            return valMid + (r_mode === "rewind" ? valLow : valHigh);
                        };
                        const r_idxMid = Math.round((r_idxHigh - r_idxLow) / 2) + r_idxLow;
                        const [valLow, valMid, valHigh] = [r_idxLow,r_idxMid,r_idxHigh].map((idx)=>{return localNums[idx]});
                        const idxMidIsValid = (r_idxLow < r_idxMid && r_idxMid < r_idxHigh);
                        const getValueToCompare = ((mode === "find") ? valAtMid : sumAtMid);
                        // console.log({getValueToCompare});
                        const resultToCompare = getValueToCompare(valLow, valMid, valHigh);
                        log.vBullet(`idxs{high:${r_idxHigh},low:${r_idxLow}, mid:${r_idxMid}},\n`+
                            CHAR_INDENT.repeat(log.indent()) + `  vals{high:${valHigh},low:${valLow}, mid:${valMid}},\n`+
                            CHAR_INDENT.repeat(log.indent()) + `  sums{target:${targetNumber},@mid:${resultToCompare}, max:${valHigh*2},max@mid:${valMid*2}},\n` +
                            CHAR_INDENT.repeat(log.indent()) + `  flags{mode:${mode}, r_mode:${r_mode}, tooSmall:${resultToCompare < targetNumber},isValid:${idxMidIsValid}\n` +
                            CHAR_INDENT.repeat(log.indent()) + `  nums{len:${localNums.length},newLen:${localNums.slice(0, idxHigh).length}}`
                        );
                        
                        if(!idxMidIsValid) { return null; }
                        if(resultToCompare === targetNumber) { return r_idxMid; }
                        
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
        log.vFooter(`[ENDED] DuoCollection for nums of size ${localNums.length} & target ${theTarget} w/ ${Object.keys(this.collection).length} results`);


        
    }
    
    
    add(pairOfNums,pairOfIdxs) {
        if (this.has(pairOfNums)) {
            log.vBullet(`!!!SKIP - Pair exists in collection - Trying to add [${pairOfNums}],[${pairOfIdxs}]`);
            return;
        }
        let aNewDuo = {}
        aNewDuo[pairOfNums] =pairOfIdxs;
        log.vBullet(`New pair of indicies w/ values summing to ${this.target} added to collection. (${JSON.stringify(aNewDuo)})`);
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

    values() {
        let result = Object.keys(this.collection)
            .map((key)=>{
                let [idxJ,idxK] = key.split(",").map((idx)=>{
                    return parseInt(idx);
                }); 
                return [idxJ,idxK];
            })
        return result;
    }

    indices (limit) {
        let storedIndicies = Object.values(this.collection);
        let translatedIndicies = storedIndicies.map(([sortedIdxJ, sortedIdxK]) => {
            return [sortedIdxJ, sortedIdxK].map((idx)=>{ return this.numsSortingMap[idx].idx;});
        });
        translatedIndicies = translatedIndicies.sort((a, b) => { 
            let diff = Math.sign(a[0] - b[0]);
            if(diff === 0) {
                diff = Math.sign(a[1] - b[1])
            }
            return diff; 
        })
        let theInidicies = typeof limit === "undefined" ? translatedIndicies : translatedIndicies.slice(0,limit);
        return theInidicies;
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
    const collection = new DuoCollection(nums, target,1);
    // console.log({vals:collection.values(),idxs:collection.indices()});
    return collection.indices(1);
}

var twoSumAll = (nums, target) => {
    console.log({nums},{target});
    const collection = new DuoCollection(nums, target);
    // console.log({vals:collection.values(),idxs:collection.indices()});
    return collection.indices();
}


function getLogFns() {
    let theLogIndent = 0;
    var writeToConsoleLog = (line) => {
            // let logArgs = line
            if (typeof arg !== "undefined") {
                console.log(line, arg);
                return;
            }
           console.log(line);
    };
    var writeToVerboseLog = (line,arg) => {
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
    // var writeToAsyncLog = async function (line, arg) {
    //     return new Promise(async (resolve, reject) => {
    //        resolve(writeToConsoleLog(line, arg));
    //     });
    // };
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

module.exports = { twoSum, twoSumAll };