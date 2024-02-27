const fs = require('fs')

/**
 * Generates a transaction and waits for its completion.
 * @param {Function} fn - The function that generates the transaction.
 * @param {...any} args - The arguments to be passed to the function.
 * @returns {Promise<Object>} - A promise that resolves to the transaction receipt.
 */
async function generateTx(fn,...args){
  const tx = await fn(args);
  let receipt; //=await tx.wait();

  await tx.wait()
  .then((rect) => {
      // console.log("the transaction was successful")
      receipt=rect;
  })
  .catch((error) => {
      receipt = error.receipt
      // console.log(error)
  })

  return new Promise((resolve, reject) => {  
    resolve(receipt)
  })
}

/**
 * Waits for multiple transactions to complete and shows the results.
 * @param {Array<Promise>} txs - An array of transaction promises.
 */
async function waitingTxs(txs){
  await Promise.all(txs).then((values) => {
    values.forEach((item,idx) => {
      showResult(parseReceipt(item))
    })
  }).catch((error)=>{
    console.log(error)
  })
}

/**
 * Parses a transaction receipt and extracts the status and block height.
 * @param {Object} receipt - The transaction receipt object.
 * @returns {Object} - An object containing the status and height of the transaction.
 */
function parseReceipt(receipt){
  if(receipt.hasOwnProperty("status")){
      return {status:receipt.status,height:receipt.blockNumber}
  }
  return {status:"",height:""}
}

/**
 * Displays the status and height of a transaction.
 * @param {Object} result - The result object containing the status and height.
 */
function showResult(result){
  console.log(`Tx Status:${result.status} Height:${result.height}`)
}

/**
 * Parses an event from a transaction receipt.
 * @param {Object} receipt - The transaction receipt object.
 * @param {string} eventName - The name of the event to parse.
 * @returns {Object|string} - The data of the event if found, otherwise an empty string.
 */
function parseEvent(receipt,eventName){
  if(receipt.hasOwnProperty("status")&&receipt.status==1){
      for(i=0;i<receipt.events.length;i++){
          if(receipt.events[i].event===eventName){
              return receipt.events[i].data;
          } 
      }
  }
  return "";
}

/**
 * Pauses the execution for the specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} - A promise that resolves after the sleep duration.
 */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Appends content to a file.
 * @param {string} filename - The name of the file.
 * @param {string} content - The content to append to the file.
 * @returns {void}
 */
function writeFile(filename,content){
  return fs.appendFileSync(filename,content,'utf8');
}

/**
 * Reads the content of a file.
 * @param {string} filename - The name of the file.
 * @returns {string} - The content of the file.
 */
function readFile(filename){
    return fs.readFileSync(filename,'utf8')
}

module.exports = {
    generateTx,
    waitingTxs,
    parseReceipt,
    parseEvent,
    showResult,
    sleep,
    writeFile,
    readFile,
}