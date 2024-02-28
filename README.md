<h1> Frontend Utilities  <img align="center" height="40" src="./img/home.svg">  </h1>
This project contains a collection of frontend utilities used by Arcology Network.

<h2> Functions   <img align="center" height="32" src="./img/code-circle.svg">  </h2>

| Name                            | Description                                                                       |
|---------------------------------|-----------------------------------------------------------------------------------|
| `generateTx`                    | Generates a transaction and waits for its completion.                             |
| `waitingTxs(txs)`               | Waits for multiple transactions to complete and shows the results.                |
| `parseReceipt(receipt)`         | Parses a transaction receipt and extracts the status and block height.            |
| `showResult(result)`            | Displays the status and height of a transaction.                                  |
| `parseEvent(receipt, eventName)`| Parses an event from a transaction receipt.                                       |
| `sleep(ms)`                     | Pauses the execution for the specified number of milliseconds.                    |
| `writeFile(filename, content)`  | Appends content to a file.                                                        |
| `readFile(filename)`            | Reads the content of a file.                                                      |
| `ensurePath(dir)`               | Make sure the directory exists; otherwise, create it.                             |


<h2> Usage   <img align="center" height="32" src="./img/palett.svg">  </h2>
Please check out [this project](https://github.com/arcology-network/examples) for information on how to use the tools to interact with the Arcology Network.

<h2> Feedback and Contributions  <img align="center" height="32" src="./img/chat.svg">  </h2>
Feel free to use these tools for benchmarking on the Arcology Network. If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

<h2> License  <img align="center" height="32" src="./img/copyright.svg">  </h2>
This toolkit is licensed under the MIT License.