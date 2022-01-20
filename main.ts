namespace servers {
    /**
     * Start all microbit servers
     */
    //% blockId=jacdac_microbit_start_all
    //% block="start all jacdac servers"
    export function startAll() {
        jacdac.startServer()
        servers.ledServer.start()
        }
    }
}
