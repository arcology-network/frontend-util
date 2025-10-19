const fs = require('fs')
const { JRPCClient, HttpAdapter } = require("@mahsumurebe/jrpc-client")
const path = require('path');

/**
 * Find all the files in the folder.
 * @param {string} dir - Path for serch.
 * @returns {Array} - List of files inside the path.
 */
function findAllFiles(dir, files_) {
  let files = files_ || [];
  let dirs = fs.readdirSync(dir);
  for(i=0;i<dirs.length;i++){
    let fullDir = path.join(dir, dirs[i]);
    if(!fs.statSync(fullDir).isDirectory()){
        files.push(fullDir);
    }
  }
  return files;
}

/**
 * Connect into RPC server and return a RPC client.
 * @param {string} rpcurl - Json RPC url.
 * @returns {Promise<Object>} - RPC client instance.
 */
async function startRpc(rpcurl) { 
  const clientInstance = new JRPCClient(new HttpAdapter(rpcurl));
  await clientInstance.start();
  return clientInstance
}

/**
 * Generates a transaction and waits for its completion.
 * @param {Object} client - RPC client instance.
 * @param {string} method - The method name for RPC request.
 * @param {Array} paramsList - The argument list for the function call
 * @returns {Promise<Object>} - A promise that resolves to the transaction receipt.
 */
async function rpcRequest(client,method,paramsList) { 
  let block
  await client.call({
      id: 1,
      jsonrpc: "2.0",
      method: method,
      params: paramsList,
  }).then((b) => {
      block=b.result;
  }).catch((error) => {
      block="";
  })
  return block;
}

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
 * @param {Object} contract - The contract object.
 * @param {string} eventName - The name of the event to parse.
 * @returns {Object|string} - The data of the event if found, otherwise an empty string.
 */
function parseEvent(receipt,contract,eventName){
  if(receipt.hasOwnProperty("status")&&receipt.status==1){
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if(eventName===parsed.name){
          for(const arg of parsed.args){
              return arg;
          }
        }
      } catch (e) {
        console.log(e);
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

/**
 * Create a stream for writing files.
 * @param {string} filename - The name of the file.
 * @returns {writeStream}
 */
function newFile(filename){
  return fs.createWriteStream(filename);
}

/**
 * Appending content to a file through a stream.
 * @param {filestream} filehandle - File stream.
 * @param {string} content - The content to append to the file.
 * @returns {void}
 */
function appendTo(filehandle,content){
  filehandle.write(content);
}

/**
 * Appending signed tx to a file through a stream.
 * @param {filestream} txfile - File stream.
 * @param {filestream} signer - signer object.
 * @param {string} tx - The content of signed tx.
 * @returns {void}
 */
async function writePreSignedTxFile(txfile,signer,tx){
  const fulltx=await signer.populateTransaction(tx)
  const rawtx=await signer.signTransaction(fulltx)
  appendTo(txfile,rawtx+',\n')
}


/**
 * Make sure the directory exists, otherwise create it.
 * @param {string} dir - path.
 * @returns {void}
 */
function ensurePath(dir){
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir)
  }
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
    newFile,
    appendTo,
    ensurePath,
    startRpc,
    rpcRequest,
    findAllFiles,
    writePreSignedTxFile,
}