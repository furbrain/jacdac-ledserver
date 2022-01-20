//combo of https://github.com/microsoft/pxt-jacdac/blob/master/led/constants.ts
// and https://github.com/microsoft/pxt-jacdac/blob/master/devices/microbit/microbitBuzzer.ts


namespace servers {
    // Service LED constants
    export const SRV_LED = 0x1e3048f8

    export const enum LedVariant { // uint8_t
        //% block="through hole"
        ThroughHole = 0x1,
        //% block="smd"
        SMD = 0x2,
        //% block="power"
        Power = 0x3,
        //% block="bead"
        Bead = 0x4,
    }

    export const enum LedCmd 
	{
        /**
         * This has the same semantics as `set_status_light` in the control service.
         *
         * ```
         * const [toRed, toGreen, toBlue, speed] = jdunpack<[number, number, number, number]>(buf, "u8 u8 u8 u8")
         * ```
         */
        Animate = 0x80,
    }

    export const enum LedReg 
	{
		/**
         * The current color of the LED.
         *
         * ```
         * const [red, green, blue] = jdunpack<[number, number, number]>(buf, "u8 u8 u8")
         * ```
         */
        Color = 0x180,		
		
        /**
         * Constant uint16_t. If known, specifies the number of LEDs in parallel on this device.
         *
         * ```
         * const [ledCount] = jdunpack<[number]>(buf, "u16")
         * ```
         */
        LedCount = 0x183,

        /**
         * Constant nm uint16_t. If monochrome LED, specifies the wave length of the LED.
         *
         * ```
         * const [waveLength] = jdunpack<[number]>(buf, "u16")
         * ```
         */
        WaveLength = 0x181,

        /**
         * Constant Variant (uint8_t). The physical type of LED.
         *
         * ```
         * const [variant] = jdunpack<[jacdac.LedVariant]>(buf, "u8")
         * ```
         */
        Variant = 0x107,
    }

    export class LEDServer extends jacdac.Server 
	{
        variant: LedVariant = LedVariant.SMD

		
        constructor() {
            super("led", SRV_LED)
        }

        public handlePacket(pkt: jacdac.JDPacket) 
		{
            // registers
            this.handleRegValue(pkt,LedReg.LedCount,"u16",1) 
            this.handleRegFormat(pkt,LedReg.Color,"u8 u8 u8",[20,30,40]) 
            this.handleRegValue(pkt,LedReg.Variant,"u8",this.variant) 

            // commands
            switch (pkt.serviceCommand) 
			{
                case LedCmd.Animate:
                    this.handleAnimateCommand(pkt)
                    break
                default:
                    pkt.possiblyNotImplemented()
                    break
            }
        }

        private handleAnimateCommand(pkt: jacdac.JDPacket) 
		{			
            const [red, green, blue] =
                pkt.jdunpack<[number, number, number]>("u16 u16 u16")
						
			light.setAll(light.rgb(red, green, blue))
            if (red == 0) 
			{
                pins.P15.digitalWrite(false)
            } else 
			{
                pins.P15.digitalWrite(true)
            }
        }
    }

    //% fixedInstance whenUsed block="led"
    export const ledServer = new LEDServer()
}
