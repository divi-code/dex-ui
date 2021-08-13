const readline = require("readline")
const express  = require("express")
const crypto   = require("crypto")
const https    = require("https")
const path     = require("path")
const fs       = require("fs")

const JSONRPCUtil = require("./JSONRPCUtil")
const AxiosUtil   = require("./AxiosUtil")
const IPScanner   = require("./IPScanner")

const serviceType = require("server_v2/service_type.json")

class Service_Client {
    constructor (args, config) {
        this.serviceType = this._setServiceType(args.type, config)
        this.peer = this._setPeer(args.peer, config)
        this.port = this._setPort(args.port, config)
        this.name = this._setName(args.name)
        this.cnfg = config
        this.app  = express()
        this.rl   = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        this.authToken = null
        this.commonAuthData = {
            hash : "",
            salt : ""
        }

        this.app.use(express.json())
    }

    _validateServiceType (type) {
        if (Object.keys(serviceType).indexOf(type))
            return type
        else
            return null
    }

    _setServiceType (type, config) {
        if (type)
            return this._validateServiceType(type)
        if (config.local_service_type)
            return this._validateServiceType(config.local_service_type)
        return null
    }

    _setPort (port, config) {
        if (port)
            return port
        if (config.local_service_port)
            return config.local_service_port
        return 0 // 'express' auto search
    }

    _setPeer (peer, config) {
        if (peer)
            return peer
        if (config.remote_service_url && config.remote_service_port)
            return `${config.remote_service_url}:${config.remote_service_port}`
        return null
    }


    _setName (name) {
        if (name)
            return name
        return this._generateName()
    }

    _generateName () {
        let hash = crypto.createHash("md5")
        hash.update((new Date().getTime() + Math.random() * Math.pow(2, 64)).toString())
        return `ds_${hash.digest("hex")}`
    }

    _readFiles (filePaths) {
        return new Promise((resolve, reject) => {
            if (filePaths.length === 0) {
                resolve(null)
                return
            }
            let filePathObj = filePaths[0]                          // { key: "string" }
            let filePath = filePathObj[Object.keys(filePathObj)[0]] // get string from object
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.log("Error: can't read file:", filePath, "Info:", err)
                    reject()
                } else {
                    filePaths.splice(0, 1)
                    this._readFiles(filePaths)
                        .then(res => {
                            let fileDataObj = { [Object.keys(filePathObj)[0]] : data }
                            if (res === null)
                                resolve(fileDataObj)
                            else
                                resolve({...res, ...fileDataObj})
                        })
                        .catch(() => reject())
                }
            })
        })
    }

    _getTLSRequirements () {
        return new Promise((resolve, reject) => {
            let files = [
                { cert : path.resolve(__dirname, "../https/server1.crt") },
                { key : path.resolve(__dirname, "../https/server1.key") },
                { ca : path.resolve(__dirname, "../https/rootCA.crt") }
            ]
            this._readFiles(files)
                .then(filesData => {
                    if (filesData === null) // array 'files' is empty
                        reject()
                    else
                        resolve(filesData)
                })
                .catch(() => reject())
        })
    }

    _setNetUtils (filesData) {
        this.axiosUtil = new AxiosUtil(this.peer,  new https.Agent({
            rejectUnauthorized : false,
            ...filesData
        }))
        this.jsonrpcUtil = new JSONRPCUtil(this.cnfg, this.peer, this.axiosUtil)
    }

    _sendConnectionRequest (filesData) {
        // filesData - {crt, key, ca}
        this.ipScanner = new IPScanner()
        this._setNetUtils(filesData)
        let ip = this.ipScanner.getHostAddress()
        return this.jsonrpcUtil.execRequest("connect", [ this.name, ip, this.port, this.serviceType ])
    }

    _authenticateService (response) {
        return new Promise((resolve, reject) => {
            if (response.auth)
                this.rl.question("Enter passphrase: ", (passphrase) => {
                    this.jsonrpcUtil.execRequest("authentication", [ this.name, passphrase ])
                        .then(res => {
                            this.authToken = res.token
                            this.refreshToken = res.refresh_token
                            resolve()
                        })
                        .catch(err => reject(err))
                })
            else
                reject(response)
        })
    }

    _connectToService () {
        return new Promise((resolve) => {
            console.log("_sendConnectionRequest")
            this._getTLSRequirements()
                .then(filesData => {
                    this._sendConnectionRequest(filesData)
                        .then(res => {
                            console.log("_authenticateService")
                            this._authenticateService(res)
                                .then(() => {
                                    console.log("Service", this.name, "successfully authenticated!")
                                    resolve(true)
                                })
                                .catch(err => {
                                    console.log(err)
                                    resolve(false)
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            resolve(false)
                        })
                })
        })
    }

    _checkConfiguration () {
        let netRule = /^https?:\/\/[a-z|0-9]+:[0-9]+/
        if (!netRule.test(this.peer))
            return {
                err : `Error: wrong peer '${this.peer}', url must satisfy the expression '${netRule}'`
            }
        return true
    }

    _countPassphraseHash (passphrase) {
        let passphraseHash, saltLength = this.commonAuthData.salt.length
        passphrase = passphrase.toString()

        const cycles = 2
        let offset = saltLength / cycles
        for (let i = 0; i < cycles; ) {
            let hash = crypto.createHash("md5")
            hash.update(passphrase + this.commonAuthData.salt.substring(i * offset, ++i * offset - 1))
            passphraseHash = hash.digest("hex")
        }
        return passphraseHash
    }

    _generateSalt () {
        this.commonAuthData = crypto.createHash("md5").update(new Date().getTime()).digest("hex")
    }

    _handlePassphrase () {
        return new Promise((resolve => this.rl.question("Create root passphrase: ", (passphrase) => {
            this.commonAuthData.hash = this._countPassphraseHash(passphrase)
            resolve()
        })))
    }

    async startClientSteps (root) {
        let configReadiness = this._checkConfiguration()
        if (configReadiness.err) {
            console.log(configReadiness.err)
            this.rl.close()
            return -1
        }
        if (!root) {
            let connectionStatus = await this._connectToService()
            if (!connectionStatus)
                console.log("Stop service", this.name, "connection")
        } else {
            this._generateSalt()
            await this._handlePassphrase()
            this._getTLSRequirements()
                .then(filesData => this._setNetUtils(filesData))
        }
        this.rl.close()
    }
}

module.exports = Service_Client
