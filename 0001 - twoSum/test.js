let twoSumJS = require('./twoSum.js');
let fs = require("fs");
let util = require("util");
let testCases = [];
testCases = testCases.concat(JSON.parse(fs.readFileSync("./testcases/testcases.json","utf-8"))); // simple cases
// testCases.push(JSON.parse(fs.readFileSync("./testcases/bigger cases/big-01.json","utf-8")));  // massive case with no reduction
// testCases.push(JSON.parse(fs.readFileSync("./testcases/bigger cases/big-02.json","utf-8")));  
// testCases.push(JSON.parse(fs.readFileSync("./testcases/bigger cases/big-03.json","utf-8")));  // massive case with many duplicates
// console.log(util.inspect(testCases, showHidden = false, depth = null, colorize = true));
// var testCases = [
    //     { input: [-1,0,1,2,-1,-4], expected:[[-1,-1,2],[-1,0,1]] },
    //     { input: [], expected:[] },
    //     { "input": [0,0,0], "expected":[[0,0,0]] },
    //     { input: [0], expected:[] }
    // ];
    
    testCases.some((valTC,idxTC)=>{
        
    // const testCaseInput = util.inspect(valTC.input, showHidden = false, depth = null, colorize = true);
    // console.log({idxTC, valTC});
    // var results = twoSumJS.twoSumvalTC.input);
    var results = twoSumJS.twoSumAll(valTC.input.nums, valTC.input.target);
    
    const lenExpected = valTC.expected.length;
    console.log({results});
    const lenActual = results.length;
    if (typeof results === "undefined") {
        console.log("ERROR - No Results Returned")
        return false;
    }

    if (lenExpected !== lenActual) {
        const largestLength = Math.max(lenExpected, lenActual);
        console.log(`Result Length Error: len(expected,actual) do not match -> ${lenExpected} !== ${lenActual}`);
        // console.log({largestLength});
        for (let index = 0; index < largestLength; index++) {
            const elementExpected = valTC.expected[index];
            const actualExpected = results[index];
            if (elementExpected !== actualExpected) {
                // console.log(`Error ${elementExpected} !== ${actualExpected}`);
            }
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
